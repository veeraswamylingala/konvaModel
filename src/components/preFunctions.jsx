import { Component } from "react";
import axios from 'axios';


class preFunctions extends Component{

      static mainFunction(param,projectId,ObjectId) {

        // var api = 'http://worldclockapi.com/api/json/est/now';
      
        // console.log("====================================")
        // console.log(api);
        //  var val = "";

        // var res =   axios.get(api).then(res => {           
        //      val = res.data.currentFileTime ;
        //      console.log(val)
        //       } )

        if(param != null )
        {
        var res = param.split("(")
   //     console.log(projectId+"_"+ObjectId+"_"+param)
          switch(res[0])
         {
            //Page / Gul Interactions Functions---------------------------
            case "openPage":
                    //dll code 
             return res[1];
             case "openEcPopup":
             return res[1];
             case "mapEcPopup":
             return res[1];
             case "openAlarmPage":
             return res[0];
             case "openEventPage":
             return res[0];
             case "openHistoryAlarmPage":
            return res[0];
            case "openDayWiseAlarmPage":
            return res[0];
            case "openTrendPage":
            return res[0];
            case "openTelemetry":
            return res[1];
            case "openStandardReportDialog":
            return res[1];
            case "openMiniTrendPopup":
            return res[1];
            case "standardPopup":
            return res[1];
            case "openPreviousPage":
            return res[1];
            case "openNextPage":
            return res[1];
            case "openFilteredAlarmPage":
            return res[1];


            //Security Functions-------------------------------------
            case "login" :
                return "Login" ;
            case "displayTime" :
                return 1  ;
            case "logoff" :
                return "Logff" ;

            //Date & Time Functions------------------------------------
            case "displayDateTime" :
                return 1 ;
            case "displayTime" :
                return 1  ;
            case "displayDate" :
                return 1 ;

            //Alarm & Event Functions------------------------------------
            case "sendAlarmAckByAll" :
                return  1;
            case "sendAlarmAckByPointId" :
                 return  1;
            case "sendAlarmAckByArea" :
                 return  res[1]; 
            case "sendAlarmAckByDevice" :
                 return  1;
            case "sendAlarmAckByPriority" :
                     return  1;
            case "sendAlarmAckByAreaTag" :
                    return  1;
            case "sendAlarmAckBySystem" :
                    return  1; 
            case "sendAlarmAckByAnalog" :
                    return  1;
            case "sendAlarmAckByDigital" :
                    return  1;
            case "getAreaAlarmStatus" :
                    return  100;
            case "getUnAckActiveAlarmCount" :

                    return  75; 
            case "getAckActiveAlarmCount" :

            var x= 10;
            var y = 20;
            var z = 30
                    return  eval("x + y + z");
            case "getUnAckNormalAlarmCount" :
                    return  25;
            case "alarmByIndex" :
                    return  1; 
            case "getAlarmAckStatus" :
                    return  1;
            case "messageByIndex" :
                    return  1;
            case "getAlarmPriorityByIndex" :
                    return  1;
            case "run_applicaiton" :
                    return  1; 


            //Miscellaneous Functions-------------------------------------
            case "getActiveServer" :
                    return  1;
            case "getMyHostName" :
                    return  1;
            case "getServerMode" :
                    return  75; 
            case "inputString" :
                    return  100;
            case "inputNumber" :
                    return  25;
            case "inputNumaricValue" :
                    return  1; 
            case "inputAnalogValue" :
                    return  1;
            case "getLastServerMessage" :
                    return  1;
            case "showMessage" :
                    return  1;
            case "displayVersion" :
                    return  1; 
            case "quitHmi" :
                    return  100;
            case "commandBoxConfirmation" :
                    return  25;
            case "showMessageBox" :
                    return  1; 
            case "waitForMsec" :
                    return  1;
        
            //ECSCADA Interface Functions--------------------------------
            case "tagAnalogValue" :
                return  1;
            case "tagDigitalValue" :
                    return  5; 
            case "sendDigitalCommand" :
                    return  0;
            case "sendAnalogCommand" :
                    return  25;
            case "sendAnalogManualValue" :
                    return  1; 
            case "sendDigitalManualValue" :
                    return  1;
            case "sendAnalogCalValue" :
                    return  1;
            case "sendDigitalCalValue" :
                    return  1;
            case "scanIn" :
                    return  1; 
            case "scanOut" :
                return  1;
            case "demandScan" :
                    return  75; 
            case "alarmInhibit" :
                    return  100;
            case "getTagName" :
                    return  25;
            case "getTagDesc " :
                    return  1; 
            case "sendSecureAnalogCommand" :
                    return  1;
            case "sendSecureDigitalCommand" :
                    return  1;
            case "sendAnalogDirectManualValue" :
                    return  1;
            case "sendDigitalDirectManualValue" :
                    return  1; 
             case "sendSecureTPLCAOCommand" :
                    return  1; 
            case "sendSecureTPLCDOCommand" :
                return  1;
            default :
         }
        }
        }

        static designLevelFunction(tag,projectId,ObjectId)
        {       
           console.log(projectId+"_"+ObjectId+"_"+tag)
                switch(tag)
                {
                        case "hidden_when": 
                        //Call projectId_objectId_tag Dll unction and
                        // get the Value return that value 
                        return false;

                        case "displayNumber":
                        //tagAnalogValue(AI_2AW2_L)
                        return 56890.5;

                        case "displayString":
                        return "DisplayString";

                        case "dynamicfilllevel":
                        return 45.3;

                        case "dynamicFillArray":
                        return   78.5;

                        case "onTouchCommand":
                        return this.mainFunction("OPenPage(TEST_2A_S3,2)",projectId,ObjectId)
                }

        }
}
export default preFunctions;