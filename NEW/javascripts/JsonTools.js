/**
 * Created by smile on 28/04/16.
 */


function transformDebugResult(jsonData){

    var jsonReturn = jsonData;

    console.log("starting json transformation");
    console.log(jsonData);
    console.log("starting json transformation");

    if(!jsonReturn.clusterContent)jsonReturn.clusterContent = ["clusterTimeSlice", "clusterX", "clusterY"];

    $.each(jsonReturn.cycles, function( iCycles, vCycles ) {

        $.each(vCycles, function( iEvent, vEvent ) {

            $.each(vEvent, function( iOfEventData, vOfEventData ) {

                var tmp = vOfEventData;
                jsonReturn.cycles[iCycles].cycleData[iEvent][iOfEventData]={};

                if(typeof tmp !== 'undefined' && tmp.length > 0)
                {
                    $.each(jsonReturn.cycleContent, function (iCycleContent, vCycleContent) {

                        jsonReturn.cycles[iCycles].cycleData[iEvent][iOfEventData][vCycleContent] = tmp[iCycleContent];

                        if (iCycleContent === jsonReturn.cycleContent.length - 1) {

                            var temp = jsonReturn.cycles[iCycles].cycleData[iEvent][iOfEventData][iCycleContent];
                            jsonReturn.cycles[iCycles].cycleData[iEvent][iOfEventData][iCycleContent] = {};

                            if (typeof temp !== 'undefined' && temp.length > 0)
                            {
                                $.each(jsonReturn.clusterContent, function (iClusterContent, vClusterContent) {

                                    console.log(jsonReturn.cycles[iCycles].cycleData[iEvent][iOfEventData][iCycleContent]);
                                    console.log("####");
                                    console.log(temp);


                                    jsonReturn.cycles[iCycles].cycleData[iEvent][iOfEventData][vCycleContent][vClusterContent] = temp[iClusterContent];

                                });
                            }

                        }

                    });
                }

            });

        });

    });

    console.log(jsonReturn);

    return jsonReturn;
}