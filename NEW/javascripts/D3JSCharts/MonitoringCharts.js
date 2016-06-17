/**
 * Created by smile on 17/05/16.
 */


function initializeMonitoringCharts(){
    draw_cpuLoadMonitorChart("svg#cpuLoadMonitorChart");
    draw_nbEventsMonitorChart("svg#nbEventsMonitorChart");
    draw_nbFilesMonitorChart("svg#nbFilesMonitorChart");
    draw_durationMonitorChart("svg#durationMonitorChart");
    draw_allPlansMonitorChart("#plansMonitorChartsContainer");
}

function updateMonitoringCharts(){
    update_cpuLoadMonitorChart("svg#cpuLoadMonitorChart");
    update_nbEventsMonitorChart("svg#nbEventsMonitorChart");
    update_nbFilesMonitorChart("svg#nbFilesMonitorChart");
    update_durationMonitorChart("svg#durationMonitorChart");
    update_allPlansMonitorChart("#plansMonitorChartsContainer");
}