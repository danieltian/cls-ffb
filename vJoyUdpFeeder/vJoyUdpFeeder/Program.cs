using Newtonsoft.Json;
using System;
using System.Dynamic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using vJoyInterfaceWrap;

namespace vJoyUdpFeeder
{
  class Program
  {
    static UdpClient UdpClient;
    static vJoy Joystick;
    static uint vJoyID = 1;
    static int Port = 5000;
    static bool IsConsoleOutputEnabled = true;

    static void Main(string[] args)
    {
      // "1" for console output + UDP broadcast, "0" for only UDP broadcast.
      if (args.Length >= 1)
      {
        IsConsoleOutputEnabled = (args[0] == "1") ? true : false;
      }
      // Use the port from the command line arguments if there is one.
      if (args.Length >= 2)
      {
        Port = Int32.Parse(args[1]);
      }
      // Use the vJoy ID from the command line arguments if there is one.
      if (args.Length >= 3)
      {
        vJoyID = UInt32.Parse(args[2]);
      }

      // Process exit callback.
      AppDomain.CurrentDomain.ProcessExit += new EventHandler(OnProcessExit);

      // Create UDP client.
      UdpClient = new UdpClient();
      UdpClient.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
      UdpClient.Client.Bind(new IPEndPoint(IPAddress.Any, Port));

      BroadcastStatus("Starting vJoy feeder...");
      BroadcastStatus("vJoy feeder UDP client started on port {0}.", Port);

      // Create the vJoy feeder.
      Joystick = new vJoy();

      if (!Joystick.vJoyEnabled())
      {
        BroadcastStatus("vJoy driver is not enabled, exiting.");
        return;
      }

      BroadcastStatus("Acquiring vJoy device #{0}...", vJoyID);
      // Try to acquire the vJoy device.
      if (!Joystick.AcquireVJD(vJoyID))
      {
        BroadcastStatus("Failed to acquire vJoy device ID #{0}, exiting.", vJoyID);
        return;
      }

      // Check the status of the vJoy device.
      var status = Joystick.GetVJDStatus(vJoyID);

      switch (status)
      {
        case VjdStat.VJD_STAT_OWN:
          BroadcastStatus("vJoy device #{0} is now owned by the feeder.", vJoyID);
          break;
        case VjdStat.VJD_STAT_FREE:
          BroadcastStatus("vJoy device is free and was not acquired by the feeder, cannot continue, exiting.");
          return;
        case VjdStat.VJD_STAT_BUSY:
          BroadcastStatus("vJoy device is already owned by another feeder, cannot continue, exiting.");
          return;
        case VjdStat.VJD_STAT_MISS:
          BroadcastStatus("vJoy device is not installed or disabled, cannot continue, exiting.");
          return;
        default:
          BroadcastStatus("vJoy device unknown error, cannot continue, exiting.");
          return;
      };

      // Register the force feedback command callback.
      Joystick.FfbRegisterGenCB(OnFfbCommand, null);

      while (true)
      {
        if (IsConsoleOutputEnabled)
        {
          // Clear the console when the 'c' key is pressed.
          var key = Console.ReadKey();
          if (key.KeyChar == 'c')
          {
            Console.Clear();
          }
        }
        else
        {
          var key = Console.Read();
        }
      }
    }

    // When the process exits, stop feeding the vJoy device.
    private static void OnProcessExit(object sender, EventArgs e)
    {
      Joystick.RelinquishVJD(vJoyID);
      UdpClient.Dispose();
    }

    private static void WriteLine(string format, params object[] args)
    {
      if (IsConsoleOutputEnabled)
      {
        Console.WriteLine(format, args);
      }
    }

    private static void Write(string format, params object[] args)
    {
      if (IsConsoleOutputEnabled)
      {
        Console.Write(format, args);
      }
    }

    private static void OnFfbCommand(IntPtr packet, object data)
    {
      dynamic response = new ExpandoObject();

      // Name of the effect.
      var type = FFBPType.PT_BLKFRREP;
      Joystick.Ffb_h_Type(packet, ref type);

      // Effect block index of the effect. If there is one, it will always be 1 due to a bug in vJoy.
      var index = -1;
      Joystick.Ffb_h_EBI(packet, ref index);

      var packetTypeString = String.Format("Packet Type: {0}, Index: {1}", GetPacketTypeName(type), index);
      WriteLine(packetTypeString);

      response.type = GetPacketTypeName(type);
      response.index = index;

      // Constant force report ------------------------------------------------
      var report = new vJoy.FFB_EFF_REPORT();
      if (Joystick.Ffb_h_Eff_Report(packet, ref report) == 0)
      {
        if (report.Polar)
        {
          WriteLine("Polar direction: {0} deg", (report.Direction) * 360 / 255);
          response.polar = report.Direction;
        }
        else
        {
          WriteLine("X Direction: {0}", report.DirX);
          WriteLine("Y Direction: {0}", report.DirY);
          response.directionX = report.DirX;
          response.directionY = report.DirY;
        }

        WriteLine("Duration: {0} ms", report.Duration);
        WriteLine("Trigger Repeat: {0}", report.TrigerRpt);
        WriteLine("Sample Period: {0}", report.SamplePrd);
        WriteLine("Gain: {0}", report.Gain);

        response.duration = report.Duration;
        response.triggerRepeat = report.TrigerRpt;
        response.samplePeriod = report.SamplePrd;
        response.gain = report.Gain;
      }

      // ----------------------------------------------------------------------
      // PID device control, used to reset the joystick.
      // ----------------------------------------------------------------------
      var control = FFB_CTRL.CTRL_DEVCONT;
      if (Joystick.Ffb_h_DevCtrl(packet, ref control) == 0)
      {
        WriteLine("PID device control: {0}", GetDeviceControlName(control));
        response.deviceControl = GetDeviceControlName(control);
      }

      // ----------------------------------------------------------------------
      var operation = new vJoy.FFB_EFF_OP();
      if (Joystick.Ffb_h_EffOp(packet, ref operation) == 0)
      {
        WriteLine("Effect Operation: {0}, Loop Count: {1}", GetEffectOperationName(operation.EffectOp), operation.LoopCount);
        response.effectOperation = GetEffectOperationName(operation.EffectOp);
        response.loopCount = operation.LoopCount;
      }

      // ----------------------------------------------------------------------
      byte gain = 0;
      if (Joystick.Ffb_h_DevGain(packet, ref gain) == 0)
      {
        WriteLine("Global device gain: {0}", gain * 100 / 255);
        response.globalDeviceGain = gain;
      }

      // ----------------------------------------------------------------------
      var condition = new vJoy.FFB_EFF_COND();
      if (Joystick.Ffb_h_Eff_Cond(packet, ref condition) == 0)
      {
        Write(condition.isY ? "Y Axis" : "X Axis");
        WriteLine(", Center position offset: {0}", condition.CenterPointOffset);
        WriteLine("Positive coefficient: {0}, Negative coefficient: {1}, Positive saturation: {2}, Negative saturation: {3}, Dead band: {4}", condition.PosCoeff, condition.NegCoeff, condition.PosSatur, condition.NegSatur, condition.DeadBand);
        response.axis = condition.isY ? 'X' : 'Y';
        response.centerPointOffset = condition.CenterPointOffset;
        response.positiveCoefficient = condition.PosCoeff;
        response.negativeCoefficient = condition.NegCoeff;
        response.positiveSaturation = condition.PosSatur;
        response.negativeSaturation = condition.NegSatur;
        response.deadBand = condition.DeadBand;
      }

      // ----------------------------------------------------------------------
      var envelope = new vJoy.FFB_EFF_ENVLP();
      if (Joystick.Ffb_h_Eff_Envlp(packet, ref envelope) == 0)
      {
        WriteLine("Attack level: {0}", envelope.AttackLevel);
        WriteLine("Fade level: {0}", envelope.FadeLevel);
        WriteLine("Attack time: {0}", envelope.AttackTime);
        WriteLine("Fade time: {0}", envelope.FadeTime);
        response.attackLevel = envelope.AttackLevel;
        response.fadeLevel = envelope.FadeLevel;
        response.attackTime = envelope.AttackTime;
        response.fadeTime = envelope.FadeTime;
      }

      // ----------------------------------------------------------------------
      var period = new vJoy.FFB_EFF_PERIOD();
      if (Joystick.Ffb_h_Eff_Period(packet, ref period) == 0)
      {
        WriteLine("Magnitude: {0}", period.Magnitude);
        WriteLine("Offset: {0}", period.Offset);
        WriteLine("Phase: {0}", period.Phase);
        WriteLine("Period: {0}", period.Period);
        response.magnitude = period.Magnitude;
        response.offset = period.Offset;
        response.phase = period.Phase;
        response.period = period.Period;
      }

      // ----------------------------------------------------------------------
      var effectType = FFBEType.ET_CONST;
      if (Joystick.Ffb_h_EffNew(packet, ref effectType) == 0)
      {
        WriteLine("Effect type: {0}", GetEffectTypeName(effectType));
        response.effectType = GetEffectTypeName(effectType);
      }

      // ----------------------------------------------------------------------
      var ramp = new vJoy.FFB_EFF_RAMP();
      if (Joystick.Ffb_h_Eff_Ramp(packet, ref ramp) == 0)
      {
        WriteLine("Ramp start: {0}", ramp.Start);
        WriteLine("Ramp end: {0}", ramp.End);
        response.rampStart = ramp.Start;
        response.rampEnd = ramp.End;
      }

      // ----------------------------------------------------------------------
      var constant = new vJoy.FFB_EFF_CONSTANT();
      if (Joystick.Ffb_h_Eff_Constant(packet, ref constant) == 0)
      {
        WriteLine("Constant magnitude: {0}", constant.Magnitude);
        response.magnitude = constant.Magnitude;
      }

      WriteLine("------------------------------");

      Broadcast(response);
    }

    private static void Broadcast(dynamic message)
    {
      var outputData = JsonConvert.SerializeObject(message);
      UdpClient.SendAsync(Encoding.UTF8.GetBytes(outputData), outputData.Length, "255.255.255.255", Port);
    }

    private static void BroadcastStatus(string format, params object[] args)
    {
      var message = String.Format(format, args);
      dynamic status = new ExpandoObject();
      status.type = "Feeder Status";
      status.message = message;

      WriteLine(message);
      Broadcast(status);
    }

    private static string GetPacketTypeName(FFBPType type)
    {
      var name = "";

      switch (type)
      {
        case FFBPType.PT_EFFREP:
          name = "Effect Report";
          break;
        case FFBPType.PT_ENVREP:
          name = "Envelope Report";
          break;
        case FFBPType.PT_CONDREP:
          name = "Condition Report";
          break;
        case FFBPType.PT_PRIDREP:
          name = "Periodic Report";
          break;
        case FFBPType.PT_CONSTREP:
          name = "Constant Force Report";
          break;
        case FFBPType.PT_RAMPREP:
          name = "Ramp Force Report";
          break;
        case FFBPType.PT_CSTMREP:
          name = "Custom Force Data Report";
          break;
        case FFBPType.PT_SMPLREP:
          name = "Download Force Sample";
          break;
        case FFBPType.PT_EFOPREP:
          name = "Effect Operation Report";
          break;
        case FFBPType.PT_BLKFRREP:
          name = "PID Block Free Report";
          break;
        case FFBPType.PT_CTRLREP:
          name = "PID Device Control";
          break;
        case FFBPType.PT_GAINREP:
          name = "Device Gain Report";
          break;
        case FFBPType.PT_SETCREP:
          name = "Set Custom Force Report";
          break;
        case FFBPType.PT_NEWEFREP:
          name = "Create New Effect Report";
          break;
        case FFBPType.PT_BLKLDREP:
          name = "Block Load Report";
          break;
        case FFBPType.PT_POOLREP:
          name = "PID Pool Report";
          break;
        default:
          name = "Unknown";
          break;
      }

      return name;
    }

    private static string GetDeviceControlName(FFB_CTRL control)
    {
      var name = "";

      switch (control)
      {
        case FFB_CTRL.CTRL_ENACT:
          name = "Enable Actuators";
          break;
        case FFB_CTRL.CTRL_DISACT:
          name = "Disable Actuators";
          break;
        case FFB_CTRL.CTRL_STOPALL:
          name = "Stop All Effects";
          break;
        case FFB_CTRL.CTRL_DEVRST:
          name = "Device Reset";
          break;
        case FFB_CTRL.CTRL_DEVPAUSE:
          name = "Device Pause";
          break;
        case FFB_CTRL.CTRL_DEVCONT:
          name = "Device Continue";
          break;
        default:
          name = "Unknown";
          break;
      }

      return name;
    }

    private static string GetEffectOperationName(FFBOP operation)
    {
      var name = "";

      switch (operation)
      {
        case FFBOP.EFF_START:
          name = "Effect Start";
          break;
        case FFBOP.EFF_SOLO:
          name = "Effect Solo Start";
          break;
        case FFBOP.EFF_STOP:
          name = "Effect Stop";
          break;
        default:
          name = "Unknown";
          break;
      }

      return name;
    }

    private static string GetEffectTypeName(FFBEType type)
    {
      var name = "";

      switch (type)
      {
        case FFBEType.ET_NONE:
          name = "False";
          break;
        case FFBEType.ET_CONST:
          name = "Constant Force";
          break;
        case FFBEType.ET_RAMP:
          name = "Ramp";
          break;
        case FFBEType.ET_SQR:
          name = "Square";
          break;
        case FFBEType.ET_SINE:
          name = "Sine";
          break;
        case FFBEType.ET_TRNGL:
          name = "Triangle";
          break;
        case FFBEType.ET_STUP:
          name = "Sawtooth Up";
          break;
        case FFBEType.ET_STDN:
          name = "Sawtooth Down";
          break;
        case FFBEType.ET_SPRNG:
          name = "Spring";
          break;
        case FFBEType.ET_DMPR:
          name = "Damper";
          break;
        case FFBEType.ET_INRT:
          name = "Inertia";
          break;
        case FFBEType.ET_FRCTN:
          name = "Friction";
          break;
        case FFBEType.ET_CSTM:
          name = "Custom Force";
          break;
        default:
          name = "Unknown";
          break;
      };

      return name;
    }
  }
}