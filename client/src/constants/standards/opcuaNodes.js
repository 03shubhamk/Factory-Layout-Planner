/**
 * Standard OPC-UA Companion Specification Node ID mappings for CNC, Robotics, and Conveyors
 */

export const OPCUA_NODE_SCHEMAS = {
  CNC_MACHINE: {
    namespace: 'ns=2',
    nodes: {
      spindleSpeed: 's=CNC.Spindle.ActualSpeed',
      spindleLoad: 's=CNC.Spindle.LoadPercent',
      feedRate: 's=CNC.Axis.ActualFeedRate',
      coolantTemp: 's=CNC.Coolant.Temperature',
      vibrationRms: 's=CNC.Sensors.VibrationRMS',
      partCounter: 's=CNC.Production.GoodPartsCount',
      machineState: 's=CNC.Status.OperatingState'
    }
  },
  ROBOTIC_ARM: {
    namespace: 'ns=3',
    nodes: {
      jointTorque: 's=Robot.Joints.TorqueArray',
      tcpSpeed: 's=Robot.TCP.LinearSpeed',
      motorTemperature: 's=Robot.Motors.MaxTemp',
      emergencyStop: 's=Robot.Safety.EStopActive',
      cycleTime: 's=Robot.Performance.LastCycleTime'
    }
  },
  CONVEYOR_SYSTEM: {
    namespace: 'ns=4',
    nodes: {
      beltSpeed: 's=Conveyor.Drive.BeltSpeed',
      motorCurrent: 's=Conveyor.Motor.CurrentDraw',
      jamSensor: 's=Conveyor.Sensors.OpticalJamDetected',
      accumulatedUnits: 's=Conveyor.Tracking.ItemCount'
    }
  }
};

export default OPCUA_NODE_SCHEMAS;
