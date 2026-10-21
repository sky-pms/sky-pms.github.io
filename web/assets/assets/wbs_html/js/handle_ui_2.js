var g_wbsInfo = null;                               // wbs 정보 - 모바일로 부터 검색 시 전달되어 온다.
var g_view_type = 'week';                           // week, daily view
var g_wbs_menu_type = 'project';                    // wbs 메뉴가 project , user 인지 여부

const CSS_BG_COLOR_CNT = 5;                         // css 에 있는 color1 ~ color5 개수
const TABLE_SIZE = 24;                              // grid table 의 width, height 는 24 px 이다.
const COLOR_CSS = ['ganttRed', 'ganttGreen', 'ganttOrange', 'ganttBlue', 'ganttGray'];
const DEFAULT_BAR_TOP = 75;


var g_search_month_data = [];           // 검색 기간 년, 월, 일, 주 차 수 정보 저장
var g_search_week_index_data = [];              // 검색 기간의 week index 저장
var g_search_day_index_data = [];               // 검색 기간의 day index 저장


//////////////////////////////////// UTIL //////////////////////////////////////////////////////////

// job click 시 선택한 job 의 project, parts 등의 정보를 조회한다.
function project_getClickWBSInfoByJobId(job_id) {
    var result = {
        'type': 'click_job',                           // 모바일에 전송하기 위한 type
        'projects_id': g_wbsInfo.data.projects_id,     // project id
        'title': g_wbsInfo.data.title     // project id
    }

    var partList = g_wbsInfo.data.partList;

    for (var i = 0; i < partList.length; i++) {
        var jobList = partList[i].jobList;
        var find_job = false;

        for (var j = 0; j < jobList.length; j++) {
            var job = jobList[j];
            if (job_id == job.documents_id) {
                find_job = true;
                result['parts_id'] = partList[i].parts_id;
                result['title'] = jobList[j].title;
                result['job_id'] = job_id;
                break;
            }
        }

        if (find_job) {
            break;
        }
    }

    console.log('getWBSInfoByJobId result :', result);
    return result;
}

// job click 시 선택한 job 의 project 등의 정보를 조회한다.
function user_getClickWBSInfoByJobId(job_id) {
    var result = {
        'type': 'click_job_user',                           // 모바일에 전송하기 위한 type
        //'projects_id' : g_wbsInfo.data.projects_id,     // project id
    }

    var projectList = g_wbsInfo.data.projectList;

    for (var i = 0; i < projectList.length; i++) {
        var jobList = projectList[i].jobList;
        var find_job = false;

        for (var j = 0; j < jobList.length; j++) {
            var job = jobList[j];
            if (job_id == job.documents_id) {
                find_job = true;
                result['projects_id'] = projectList[i].projects_id;
                result['job_id'] = job_id;
                break;
            }
        }

        if (find_job) {
            break;
        }
    }

    console.log('getWBSInfoByJobId result :', result);
    return result;
}


// part 에 속한 job list 의 평균 진행률을 계산한다.
function getProgressByJobList(jobList) {
    var sum = 0;

    for (var i = 0; i < jobList.length; i++) {
        sum += jobList[i].progress;
    }

    return Math.floor(sum / jobList.length);
}

// job list 에서 가장 빠른 날짜와 가장 늦은 날짜를 찾는다.
function calcJobListStartAndEndDate(jobList) {
    //console.log('calcJobListStartAndEndDate', jobList);

    if (jobList == undefined
        || jobList == null
        || jobList.length == 0) {
        console.log('calcJobListStartAndEndDate no jobList');
        return null;
    }

    var r_start_dt = jobList[0].start_dt;
    var r_end_dt = jobList[0].end_dt;

    for (var i = 0; i < jobList.length; i++) {
        var start_dt = jobList[i].start_dt;
        var end_dt = jobList[i].end_dt;

        if (moment(r_start_dt).isSameOrBefore(start_dt)) {
            // 그대로..
        } else {
            r_start_dt = start_dt;
        }

        if (moment(r_end_dt).isSameOrAfter(end_dt)) {
            // 그대로..
        } else {
            r_end_dt = end_dt;
        }
    }

    //console.log(`r_start_dt[${r_start_dt}], r_end_dt[${r_end_dt}]`);

    return {
        'r_start_dt': r_start_dt,      // part job 중 가장 앞의 날짜
        'r_end_dt': r_end_dt           // part job 중 가장 뒤의 날짜
    };
}

// 해당 달의 한주차에 s day, e day 사이에 목요일 포함되어 있는지 체크
function isContainThursday(target = "2021-05-29", s_day, e_day) {

    var target_moment_month = moment(target).format('YYYY-MM');     // s, e 의 기준 달

    var dayRange = moment.range(s_day, e_day);
    for (let mday of dayRange.by('days')) {
        //console.log(mday.day());
        var mday_month = mday.format('YYYY-MM');
        if (target_moment_month == mday_month   // 해당월에서
            && mday.day() == 4) return true;    // 목요일 발견
    }

    return false;
}

// target day 가 weekRange 에 포함된 날인지 체크
function isContainDayByWeekRange(weekRange, target = "2021-05-29") {
    var check_m = moment(target).set('hour', 12).set('minute', 0).set('second', 0); // 정오 기준
    var contain = check_m.isBetween(weekRange.start, weekRange.end);
    return contain;
}

// target 월의 주차 개수 정보 및 week range 정보를 리턴한다.
function getMonthWeekInfo(target = "2021-07") {

    var weekRange = getMonthWeekRange(target);

    var month_data = {
        "month_key": target,
        "week_range_info": []
    };

    for (var i = 0; i < weekRange.length; i++) {
        var find_thursday = isContainThursday(target, weekRange[i].start, weekRange[i].end);
        //console.log(find_thursday)

        var weekObj = {
            'find_thursday': find_thursday,
            'start': weekRange[i].start.format("YYYY-MM-DD"),
            'end': weekRange[i].end.format("YYYY-MM-DD")
        }

        month_data.week_range_info.push(weekObj);
    }

    var weekCnt = 0;
    for (var i = 0; i < month_data.week_range_info.length; i++) {
        var weekObj = month_data.week_range_info[i];
        if (weekObj.find_thursday == true) {
            weekCnt++;
        }
    }
    month_data['totalWeekCnt'] = weekCnt;

    return month_data;
}

// target 월의 week range array 를 리턴한다.
function getMonthWeekRange(target = "2021-07") {
    var check_moment = moment(target)

    // year and month are variables
    var year = check_moment.get('year');
    var month = check_moment.get('month');

    /*
    var startDate = moment.utc([year, month])

    // Get the first and last day of the month
    var firstDay = moment(startDate).startOf('month');
    var endDay = moment(startDate).endOf('month');
    */

    var firstDay = moment(check_moment).startOf('month');
    var endDay = moment(check_moment).endOf('month');


    // Create a range for the month we can iterate through
    var monthRange = moment.range(firstDay, endDay);

    // Get all the weeks during the current month
    weeks = []
    for (let mday of monthRange.by('days')) {
        if (weeks.indexOf(mday.week()) === -1) {
            weeks.push(mday.week());
        }
    }

    // Create a range for each week
    var calendar = []
    for (let index = 0; index < weeks.length; index++) {
        var weeknumber = weeks[index];

        var firstWeekDay = moment().year(year).week(weeknumber).day(0);
        var lastWeekDay = moment().year(year).week(weeknumber).day(6);

        if (month == 11 && (weeks.length - 1) == index) {
            firstWeekDay = moment().year(year).week(weeks[index - 1]).day(0);
            firstWeekDay.add(7, "day");

            lastWeekDay = moment().year(year).week(weeks[index - 1]).day(0);
            lastWeekDay.add(13, "day");
        }

        if (firstWeekDay.isBefore(firstDay)) {
            firstWeekDay = firstDay;
        }

        if (lastWeekDay.isAfter(endDay)) {
            lastWeekDay = endDay;
        }

        firstWeekDay.set('hour', 0).set('minute', 0).set('second', 0)
        lastWeekDay.set('hour', 23).set('minute', 59).set('second', 59)

        var weekRange = moment.range(firstWeekDay, lastWeekDay)
        calendar.push(weekRange)
    }

    //console.log('>>> calendar', calendar)
    return calendar
}

// target 날짜가 월의 몇번째 week 인지 key 를 찾는다.
function findWeekNumKey(target = "2021-11-30") {
    var monthWeekRange = getMonthWeekRange(target);
    //console.log('monthWeekRange', monthWeekRange);

    var base_first_week_num = 0;

    for (var i = 0; i < monthWeekRange.length; i++) {
        var contain_target_day = isContainDayByWeekRange(monthWeekRange[i], target);
        //console.log('isContainDayByWeekRange', contain_target_day);

        var contain_thursday = isContainThursday(target, monthWeekRange[i].start, monthWeekRange[i].end);
        //console.log('contain_thursday', contain_thursday);
        if (contain_thursday) {
            base_first_week_num++;      // 목요일을 포함한 주가 1 주차이다.
        }

        if (i == 0) {
            if (contain_target_day) {
                if (contain_thursday) {
                    var this_month = moment(target).format('YYYY-MM');
                    var key = `${this_month}-week-${base_first_week_num}`;
                    //console.log('find i=0', key);
                    return key;

                } else {
                    //console.log('check pre month');
                    var pre_month = moment(target).subtract(1, 'months').format('YYYY-MM');
                    var pre_month_info = getMonthWeekInfo(pre_month);
                    var key = `${pre_month}-week-${pre_month_info.totalWeekCnt}`;
                    //console.log('find pre month week', key);
                    return key;
                }
            }

        } else if (i == monthWeekRange.length - 1) {
            if (contain_target_day) {
                if (contain_thursday) {
                    var this_month = moment(target).format('YYYY-MM');
                    var key = `${this_month}-week-${base_first_week_num}`;
                    //console.log('find i == monthWeekRange-1', key);
                    return key;

                } else {
                    //console.log('check next month');
                    var next_month = moment(target).add(1, 'months').format('YYYY-MM');
                    var key = `${next_month}-week-${1}`;
                    //console.log('find next month week', key);
                    return key;
                }
            }

        } else {
            if (contain_target_day && contain_thursday) {
                //console.log('find index :', base_first_week_num);
                var this_month = moment(target).format('YYYY-MM');
                var key = `${this_month}-week-${base_first_week_num}`;
                //console.log('find this month week', key);
                return key;
            }
        }
    }

    throw new Error('cant not find week key');
}




/////////////////////////////////////// PRE DATA PARSING ///////////////////////////////////////

// 상단 검색 기간에 해당하는 월, 주, 일 정보 표시에 해당하는 data 를 미리 준비해둔다.
function createSearchBaseRangeData() {
    g_search_month_data = [];
    g_search_week_index_data = [];
    g_search_day_index_data = [];


    var firstDay = moment(g_wbsInfo.s_start_dt).startOf('month');
    var endDay = moment(g_wbsInfo.s_end_dt).endOf('month');

    const range = moment.range(firstDay, endDay);       // 검색 시작, 종료일 범위 생성, s_start_dt="2021-01-01", s_end_dt="2021-12-11"

    var s_year = moment(g_wbsInfo.s_start_dt, 'YYYY-MM-DD').year();
    var e_year = moment(g_wbsInfo.s_end_dt, 'YYYY-MM-DD').year();


    for (var year = s_year; year <= e_year; year++) {

        var _year = year;
        console.log(' =========>>>>>> _year', _year);

        var month_data = {
            'year': `${_year}`,
            'month_info': [],
            'total_weekCnt': 0,
            'total_days': 0
        };

        for (let month of range.by('month')) {                      // 월별로 범위 loop 문 돌린다.           
            if (_year == month.get('year')) {            // 월의 중복 방지
                var month_key = month.format('YYYY-MM')             // 월별 key
                //console.log(month_key)                
                var _month_data = {
                    'year': month_data.year,
                    'month': `${month.format('MM')}`
                };

                var weekInfoObj = getMonthWeekInfo(month_key);          // month에 해당하는 week 정보를 가져온다.
                _month_data['weekCnt'] = weekInfoObj.totalWeekCnt;      // 한달에 몇주차까지 있는지 저장
                month_data.total_weekCnt += weekInfoObj.totalWeekCnt;   // 검색 기간에 총 몇주를 표시하는지

                var endDay = month.endOf('month').date();
                _month_data['endDay'] = endDay;                     // 한달에 몇일까지 있는지 저장
                month_data.total_days += endDay;        // 검색 기간이 총 몇일인지

                month_data.month_info.push(_month_data);            // 날짜 정보 저장


                // set daily index array    - daily view 에서 bar를 그릴때 위치 계산 시 기준 data 생성
                for (var i = 1; i <= endDay; i++) {
                    var _day_data = {
                        'year': _month_data.year,
                        'month': _month_data.month
                    };
                    _day_data['day_index'] = `${i}`;
                    g_search_day_index_data.push(_day_data);
                }


                // set week index array     - week view 에서 bar를 그릴때 위치 계산 시 기준 data 생성
                for (var i = 1; i <= weekInfoObj.totalWeekCnt; i++) {
                    var _week_data = {
                        'year': _month_data.year,
                        'month': _month_data.month
                    };

                    _week_data['week_index'] = `${i}`;
                    g_search_week_index_data.push(_week_data);
                }
            }
        }

        g_search_month_data.push(month_data);
    }

    /*
        g_search_month_data :
            [
                {
                    year: "2021",
                    month_info: [
                        {year: '2021', month: '01', weekCnt: 4, endDay: 31}
                        {year: '2021', month: '02', weekCnt: 4, endDay: 28}
                        {year: '2021', month: '03', weekCnt: 4, endDay: 31}
                        {year: '2021', month: '04', weekCnt: 5, endDay: 30}
                        {year: '2021', month: '05', weekCnt: 4, endDay: 31}
                        {year: '2021', month: '06', weekCnt: 4, endDay: 30}
                        {year: '2021', month: '07', weekCnt: 5, endDay: 31}
                        {year: '2021', month: '08', weekCnt: 4, endDay: 31}
                        {year: '2021', month: '09', weekCnt: 5, endDay: 30}
                        {year: '2021', month: '10', weekCnt: 4, endDay: 31}
                        {year: '2021', month: '11', weekCnt: 4, endDay: 30}
                        {year: '2021', month: '12', weekCnt: 5, endDay: 31}
                    ]
                },
                ....... 이하 동일
            ]            
    */
    console.log('g_search_month_data', g_search_month_data);

    /*
        g_search_week_index_data :
            [
                {year: '2021', month: '01', week_index: '1'}
                {year: '2021', month: '01', week_index: '2'}
                {year: '2021', month: '01', week_index: '3'}
                {year: '2021', month: '01', week_index: '4'}
                {year: '2021', month: '02', week_index: '1'}
                {year: '2021', month: '02', week_index: '2'}
                {year: '2021', month: '02', week_index: '3'}
                {year: '2021', month: '02', week_index: '4'}
                {year: '2021', month: '03', week_index: '1'}
                .... 검색 마지막 달까지
            ]
    */
    console.log('g_search_week_index_data', g_search_week_index_data);

    /*
        g_search_day_index_data :
        [
            {year: '2021', month: '01', day_index: '1'}
            {year: '2021', month: '01', day_index: '2'}
            {year: '2021', month: '01', day_index: '3'}
            {year: '2021', month: '01', day_index: '4'}
            {year: '2021', month: '01', day_index: '5'}
            {year: '2021', month: '01', day_index: '6'}
            {year: '2021', month: '01', day_index: '7'}
            {year: '2021', month: '01', day_index: '8'}
            .... 검색 마지막 날까지
        ]
    */
    console.log('g_search_day_index_data', g_search_day_index_data);
}


// part 와 job list 에 미리 draw 하기위한 table index 값을 설정한다.
function preSetViewTableIndex() {
    var _List = null;

    if (g_wbs_menu_type == 'project') {     // project wbs
        _List = g_wbsInfo.data.partList;
    } else {                                // user wbs     -- user 의 경우 part data 가 projectList 이름으로 넘어온다.
        _List = g_wbsInfo.data.projectList;
    }

    //
    for (var i = 0; i < _List.length; i++) {
        var _item = _List[i];

        // job list 중에서 제일 앞의 날짜와 제일 뒤의 날짜를 계산한다.
        var r_date = calcJobListStartAndEndDate(_item.jobList);  // part 기간 색 표시를 위해
        if (r_date == null) {
            _item['table_start_index'] = -1;
            _item['table_end_index'] = -1;
            continue;
        }

        // part 의 전체 기간에 따른 index 조회
        var indexObj = get_date_TableIndex(r_date.r_start_dt, r_date.r_end_dt);
        if (indexObj) {
            _item['table_start_index'] = indexObj.start_index;
            _item['table_end_index'] = indexObj.end_index;

            var bar_data = getBar_left_width_data(indexObj.start_index, indexObj.end_index);
            _item['bar_data'] = bar_data;

        } else {
            _item['table_start_index'] = -1;
            _item['table_end_index'] = -1;
        }


        // job 에 기간에 따른 index 조회
        for (var k = 0; k < _item.jobList.length; k++) {
            var job_item = _item.jobList[k];
            var indexObj = get_date_TableIndex(job_item.start_dt, job_item.end_dt);
            if (indexObj) {
                job_item['table_start_index'] = indexObj.start_index;
                job_item['table_end_index'] = indexObj.end_index;

                var bar_data = getBar_left_width_data(indexObj.start_index, indexObj.end_index);
                job_item['bar_data'] = bar_data;

            } else {
                job_item['table_start_index'] = -1;
                job_item['table_end_index'] = -1;
            }

        }
    }

    if (g_wbs_menu_type == 'project') {     // project wbs
        console.log('preSetViewTableIndex', g_wbsInfo.data.partList);
    } else {
        console.log('preSetViewTableIndex', g_wbsInfo.data.projectList);
    }
}


// 조회하는 날짜를 검색 기준 index 를 반환한다.
// index 란 상단 가로 table num 의 순서이다.
function get_date_TableIndex(start_d = '2020-02-27', end_d = '2021-04-13') {
    console.log(' >>>> get_date_WeekTableIndex before', start_d, end_d);

    var search_start_d = moment(g_wbsInfo.s_start_dt).startOf('month').format('YYYY-MM-DD');      // 검색하는 날짜의 달의 첫째 날
    var search_end_d = moment(g_wbsInfo.s_end_dt, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD');            // 검색하는 날짜의 달의 마지막 날
    console.log(` >>>> g_wbsInfo.s_start_dt[${g_wbsInfo.s_start_dt}] ==> search_start_d[${search_start_d}]`);
    console.log(` >>>> g_wbsInfo.s_end_dt[${g_wbsInfo.s_end_dt}] ==> search_end_d[${search_end_d}]`);

    var isBetween_start = moment(start_d).isBetween(search_start_d, search_end_d);          // 시작 날짜가 검색 날짜 사이에 있는지 체크
    var isBetween_end = moment(end_d).isBetween(search_start_d, search_end_d);
    console.log(` >>>> isBetween_start[${isBetween_start}], isBetween_end[${isBetween_end}]`);


    if (isBetween_start || isBetween_end) {         // 시작이나, 종료 날짜가 하나라도 검색 기간 안에 있으면 검색 기간에 물려있는 것으로 본다.
        if (isBetween_start == false) {
            start_d = search_start_d;               // 시작 날짜가 검색 기간안에 없다면 시작 날짜를 검색 시작 날로 바꾼다. 
        }

        if (isBetween_end == false) {               // 종료 날짜가 검색 기간안에 없다면 종료 날짜를 검색 종료 날로 바꾼다. 
            end_d = search_end_d;
        }

    } else {
        // 검색 기간이 시작, 종료 날자의 사이에 있다면 (검색이 더 작다.)
        isBetween_start = moment(search_start_d).isBetween(start_d, end_d);
        isBetween_end = moment(search_end_d).isBetween(start_d, end_d);
        if (isBetween_start && isBetween_end) {
            start_d = search_start_d;
            end_d = search_end_d;

        } else {
            console.log('no data between search start and end');            // 검색 기간이 기준 날과 아무런 역임이 없을 경우...화면에 표시 할 수 없다.
            return null;
        }
    }

    //console.log('get_date_TableIndex after', start_d, end_d);  

    const range = moment.range(start_d, end_d);     // 최종 기준 날짜 range      

    var start_index = -1;                           // 시작날짜의 index
    var end_index = -1;

    // 시작은 앞에서부터 찾는다.
    for (let day of range.by('day')) {
        start_index = getStartTableIndex(day.format('YYYY-MM-DD'));
        if (start_index != -1) {
            break;
        }
    }
    if (start_index == -1) {        // 시작 점이 없다.. 그릴 수 없다.
        console.log('can not find start index');
        return null;
    }


    // 종료는 뒤에서 부터 차자는다.
    for (let day of range.reverseBy('day')) {   // 거꾸로 - reverse         
        end_index = getEndTableIndex(day.format('YYYY-MM-DD'));
        if (end_index != -1) {
            break;
        }
    }
    if (end_index == -1) {        // 종료 점이 없다.. 그릴 수 없다.
        console.log('can not find end index');
        return null;
    }


    var r_data = {
        'start_index': start_index,
        'end_index': end_index
    };
    //console.log('get_date_TableIndex', start_d, end_d, r_data);  

    return r_data;
}

// 오늘 날짜의 key를 계산하여 리턴한다. - date 영역에서 오늘 날짜에 color 표시위해.
function getTodayKey() {
    var today_moment = moment();
    var today_ = today_moment.format('YYYY-MM-DD');

    var key = null;
    if (g_view_type == 'week') {
        key = findWeekNumKey(today_);
    } else {
        key = `${today_moment.get('year')}-${today_moment.format('MM')}-daily-${today_moment.get('date')}`;
    }

    console.log('getTodayKey = ', key);
    return key;
}

// 오늘날짜의 week or day 에서의 index 를 찾는다.
function getTodayIndex() {
    var today_index = getStartTableIndex(moment().format('YYYY-MM-DD'));    // 오늘 날짜의 시작 위치를 구한다.
    console.log('getTodayIndex', today_index);
    return today_index;
}

// 오늘 날짜 구분 line 을 그린다.
function drawTodayLine() {
    var today_index = getTodayIndex();    // 오늘 날짜의 시작 위치를 구한다.    

    if (today_index == -1) {
        return;
    }

    var position = getBar_left_width_data(today_index, today_index);     // today line 은 width 가 한칸이다. 즉, 종료 인덱스가 시작 인덱스와 갔다. width 만 1 * TABLE_SIZE 이다. 
    // {left: 816, width: 24}

    var left = position.left;
    var height = getTableHeight() - (2 * TABLE_SIZE);   // 상단 날짜 2 row 를 제외한다.

    $(`#today-bar`).css({
        'margin-left': `${left}px`,
        'height': `${height}px`
    });
    $(`#today-bar`).removeClass('hide');
}

// 오늘 날짜의 bar height 를 업데이트 한다.
function updateTodayLineHeight() {
    var height = getTableHeight() - (2 * TABLE_SIZE);   // 상단 날짜 2 row 를 제외한다.

    $(`#today-bar`).css({
        'height': `${height}px`
    });
}


// 검색 날짜에 해당한는 index 를 앞에서 부터 찾는다.
function getStartTableIndex(search_day = '2021-04-13') {

    var search_key = null;
    if (g_view_type == 'week') {     // week view
        search_key = findWeekNumKey(search_day);              // day 날짜에 해당하는 week key 를 가져온다. - 2021-06-week-2
    } else {
        var day = moment(search_day);
        search_key = `${day.format('YYYY-MM')}-daily-${day.date()}`;        // day 날짜에 해당하는 daily key 를 만든다. - 2021-07-daily-12
    }
    //console.log('getStartTableIndex search_key', search_key);         

    if (g_view_type == 'week') {        // week view

        for (var i = 0; i < g_search_week_index_data.length; i++) {
            var weekData = g_search_week_index_data[i];    // {year: "2021", month: "01", week_index: "1"}      
            var base_key = `${weekData.year}-${weekData.month}-week-${weekData.week_index}`;
            if (search_key == base_key) {
                //console.log('getStartWeekIndex find key = ', base_key, i);
                return i;
            }
        }

    } else {                            // daily view

        for (var i = 0; i < g_search_day_index_data.length; i++) {
            var dayData = g_search_day_index_data[i];    // {year: '2021', month: '01', day_index: '1'}      
            var base_key = `${dayData.year}-${dayData.month}-daily-${dayData.day_index}`;
            if (search_key == base_key) {
                //console.log('getStartWeekIndex find key = ', base_key, i);
                return i;
            }
        }

    }

    return -1;
}

// 검색 날짜에 해당한는 index 를 뒤에서 부터 찾는다.
function getEndTableIndex(search_day = '2021-04-13') {

    var search_key = null;
    if (g_view_type == 'week') {     // week view
        search_key = findWeekNumKey(search_day);              // day 날짜에 해당하는 week key 를 가져온다. - 2021-06-week-2
    } else {
        var day = moment(search_day);
        search_key = `${day.format('YYYY-MM')}-daily-${day.date()}`;        // day 날짜에 해당하는 daily key 를 만든다. - 2021-07-daily-12
    }
    //console.log('getEndTableIndex search_key', search_key);         

    if (g_view_type == 'week') {        // week view

        for (var i = g_search_week_index_data.length - 1; i >= 0; i--) {
            var weekData = g_search_week_index_data[i];    // {year: "2021", month: "01", week_index: "1"}      
            var base_key = `${weekData.year}-${weekData.month}-week-${weekData.week_index}`;
            if (search_key == base_key) {
                //console.log('getEndWeekIndex find key = ', base_key, i);
                return i;
            }
        }

    } else {                            // daily view

        for (var i = g_search_day_index_data.length - 1; i >= 0; i--) {
            var dayData = g_search_day_index_data[i];    // {year: '2021', month: '01', day_index: '1'}      
            var base_key = `${dayData.year}-${dayData.month}-daily-${dayData.day_index}`;
            if (search_key == base_key) {
                //console.log('getEndWeekIndex find key = ', base_key, i);
                return i;
            }
        }

    }

    return -1;
}

// grid 가 그려지는 layout 의 width - 검색 기간에 의해 정해진다.
function getTableWidth() {
    var index_cnt = 0;

    if (g_view_type == 'week') {     // week view
        index_cnt = g_search_week_index_data.length;    // 전체 index
    } else {
        index_cnt = g_search_day_index_data.length;
    }

    var width = TABLE_SIZE * index_cnt;
    console.log('getTableWidth', width);

    return width;
}

// 왼쪽의 리스트(part, job list) 보여지는 개수에 따른 높이 계산 필요
function getTableHeight() {
    var list = $(`.menu_list:not(.hide)`);

    return (list.length * TABLE_SIZE) + (2 * TABLE_SIZE);       // 현재 화면에 보여지는 메뉴 개수 * 24, 상단 날짜 과녈 2 줄 * 24 이다.
}


// bar 의 table 내 위치(px)를 계산한다.
function getBar_left_width_data(startIndex, endIndex) {

    var left = startIndex * TABLE_SIZE;                 // absolute position 에 사용
    width = (endIndex - startIndex + 1) * TABLE_SIZE;

    var position = {
        'left': left,
        'width': width
    };
    // console.log('getBar_left_width_data', startIndex, endIndex, position);
    return position;
}



///////////////////////////////////////////// CLICK /////////////////////////////////////////////
// 왼쪽 메뉴의 parts 선택 시 bar 및 메뉴 show, hide 한다. 
function clickLeftPartsMenu(target) {
    var menu_id = $(target).attr('id');
    console.log('clickLeftPartsMenu', menu_id);

    var id = menu_id.split('_')[1];
    updateJobMenuAndBar(id);
}

// part or project 선택 시 하위의 job list 를 보여준다.
function clickPartsBar(target) {
    var click_bar_id = $(target).attr('id');
    console.log('clickPartsBar', click_bar_id);
    updateJobMenuAndBar(click_bar_id);
}

// job bar show, hide 한다.
function updateJobMenuAndBar(click_bar_id) {

    var visible_menu_list = $(`.menu_list.job_type.${click_bar_id}:not(.hide)`);

    if (visible_menu_list.length == 0) {    // 모두 hide 된 상태 - close 된 상태
        // open 시킨다.
        $(`.menu_list.job_type.${click_bar_id}`).removeClass('hide');   // 왼쪽 메뉴의 job 을 보여준다.
        $(`.bar.${click_bar_id}`).removeClass('hide');                  // 오른쪽 job 의 bar 를 보여준다.

    } else {                                // open 된 상태
        // close 시킨다.
        visible_menu_list.addClass('hide');
        $(`.bar.${click_bar_id}`).addClass('hide');
    }

    updateTableSize();          // show, hide 여부에 따라 height 값이 바뀌니 화면 영역을 업데이트한다.
    updateTodayLineHeight();    // show, hide 여부에 따라 오늘날짜 표시 bar 의 height 를 업데이트 한다.
}

// job itme 을 선택 시 모바일에 관련 정보를 전송한다.
function clickJobBar(target) {
    var click_job_id = $(target).attr('id');
    console.log('clickJobBar', click_job_id);

    // 선택 한 job 의 기타 정보를 조합하여 가져온다. - 모바일에 보내기 위해
    if (g_wbs_menu_type == 'project') {         // wbs project
        result = project_getClickWBSInfoByJobId(click_job_id);
    } else if (g_wbs_menu_type == 'user') {     // wbs user
        result = user_getClickWBSInfoByJobId(click_job_id);
    }

    if (result) {
        reqMobileInterface(result);                     // 모바일에 전송한다.
    }
}


///////////////////////////////////////////// UI /////////////////////////////////////////////

// 화면 초기화
function clearWBSView() {
    $('.leftPanel').empty();
    $('#month-layout').empty();
    $('.outline').empty();
}

// 왼쪽 메뉴 리스트를 생성한다. - part(project), job list
function createLeftPanel(_List) {

    $('.leftPanel').append(`<div class="row spacer"></div>`);

    /*
        <div style="margin-top: 48px">
            <span class="row name fn-label">분류1dfdsFSDGBbv vt</span>
            <div><span class="row name fn-label work">업무1-1eertvrtbytyfsdf</span></div>
            <div><span class="row name fn-label work">업무1-2</span></div>
        </div>
    */

    for (var i = 0; i < _List.length; i++) {
        var _item = _List[i];                               // project or part 이다.

        if (_item.bar_data == undefined) {                  // draw 할 bar 정보가 없다면 정상적인 data 가 아닌것으로 본다.
            continue;
        }
        //console.log('createLeftPanel', _item);

        var addHtml = '<div>';
        if (i == 0) {   // 첫번째 row 에만 48 margin top 을 준다. - 날짜 영역 2 row와 맞추기 위해
            addHtml = `<div style="margin-top: 48px">`;
        }

        var title, id;
        if (g_wbs_menu_type == 'project') {     // project wbs
            title = _item.parts_name;
            id = _item.parts_id;
        } else {
            title = _item.projects_name;
            id = _item.projects_id;
        }

        // part(project) 생성        
        addHtml += `<span id="menu_${id}" class="row name fn-label menu_list" onclick="clickLeftPartsMenu(this)">${title}</span>`;

        // job 생성
        for (var k = 0; k < _item.jobList.length; k++) {
            var job_item = _item.jobList[k];                // job

            if (job_item.bar_data == undefined) {           // draw 할 bar 정보가 없다면 정상적인 data 가 아닌것으로 본다.
                continue
            }
            //console.log('job_item', job_item);            

            addHtml += `<div id="menu_${job_item.documents_id}" class="menu_list job_type ${id} hide"><span class="row name fn-label work">${job_item.title}</span></div>`;
        }

        addHtml += `</div>`;

        $('.leftPanel').append(addHtml);
    }
}

// data 를 보여주기 위한 (날짜관련 + bar) layour 의 width, height를 업데이트 한다.
function updateTableSize() {
    // <div class="dataPanel" style="width:2496px; height:504px;"> 의 전체 높이와 넓이를 설정한다.
    var tableWidth = getTableWidth();
    var tableHeight = getTableHeight();
    console.log(`updateTableSize tableWidth[${tableWidth}], tableHeight[${tableHeight}]`);
    $('.dataPanel').css({
        'width': `${tableWidth}px`,
        'height': `${tableHeight}px`
    });
}

/*
    검색 기간에 해당하는 상단 날짜 정보를 만든다.
    createLeftPanel() 이후에 설정해야 한다. - 전체 width, height 를 설정하기 때문
*/
function createDatePanel() {
    /*
        <div class="group" style="width:120px;">
            <div class="month">
                <span>2021.01</span>
            </div>
            <div class="row day">
                <div class="fn-label">1</div>
            </div>
            <div class="row day today">
                <div class="fn-label">2</div>
            </div>
            <div class="row day">
                <div class="fn-label">3</div>
            </div>
            <div class="row day">
                <div class="fn-label">4</div>
            </div>
        </div>		
    */

    // g_search_month_data 에 이미 필요한 정보들이 들어 있다.
    for (var i = 0; i < g_search_month_data.length; i++) {      // 루트는 year 로 나누어져 있다.
        var month_item = g_search_month_data[i];

        // year - month 별
        for (var j = 0; j < month_item.month_info.length; j++) {    // year 안의 month 배열
            var cnt = 0;

            var month_info = month_item.month_info[j];             // month 정보
            if (g_view_type == 'week') {
                cnt = month_info.weekCnt;                           // month 의 총 week 수
            } else {
                cnt = month_info.endDay;                            // month 의 총 day 수
            }

            var month_width = cnt * TABLE_SIZE;                     // month 의 width 계산
            var month_html = `<div class="group" style="width:${month_width}px;">`;

            // month 2021.01
            month_html += `<div class="month"><span>${month_info.year}.${month_info.month}</span></div>`;

            // week or day index
            for (var k = 1; k <= cnt; k++) {
                var key = null;                 // 특정 날짜의 위치를 찾기위한 key 생성하여 id 에 추가한다.
                if (g_view_type == 'week') {
                    key = `${month_info.year}-${month_info.month}-week-${k}`;
                } else {
                    key = `${month_info.year}-${month_info.month}-daily-${k}`;
                }

                month_html += `<div id="${key}" class="row day"><div class="fn-label">${k}</div></div>`;
            }

            month_html += `</div>`;

            $('#month-layout').append(month_html);
        }

    }

    ////////////////// draw today //////////////////
    var todayKey = getTodayKey();           // 오늘 날짜 기준 표시를 위해
    $(`#${todayKey}`).addClass('today');    // week, day 에 id 로 key가 추가되어 있다.

}

/*
    part, job 관련 bar UI 를 생성한다.
    createDatePanel() 생성 후 호출해야 한다. 동일한 부모 div 를 사용하여 날짜 관련 html 먼저 만들고 온다.
*/
function createBarHtml(_List) {
    /*
        <div>
            <div class="bar ganttRed" style="margin-left:0; width:96px">
                <span class="fn-label">46% (2)</span>
            </div>
            <div class="bar ganttRed" style="margin-left:0; width:48px">
                <span class="fn-label">박미일</span>
            </div>
            <div class="bar ganttRed" style="margin-left:24px; width:72px;">
                <span class="fn-label">김성운dsfsdfsdf</span>
            </div>
        </div>
    */

    for (var i = 0; i < _List.length; i++) {
        var bar_html = '<div>';

        var _item = _List[i];                               // project or part 이다.

        var color_index = (i % COLOR_CSS.length);

        var id;
        if (g_wbs_menu_type == 'project') {     // project wbs            
            id = _item.parts_id;
        } else {
            id = _item.projects_id;
        }

        if (_item.bar_data == undefined) {                  // draw 할 bar 정보가 없다면 정상적인 data 가 아닌것으로 본다.
            continue;
        }

        // part의 bar 이다.  
        bar_html += `<div id="${id}" class="bar ${COLOR_CSS[color_index]}" style="margin-left:${_item.bar_data.left}px; width:${_item.bar_data.width}px" onclick="clickPartsBar(this)"><span class="fn-label">${getProgressByJobList(_item.jobList)}% (${_item.jobList.length})</span></div>`;

        // job 생성
        for (var k = 0; k < _item.jobList.length; k++) {
            var job_item = _item.jobList[k];                // job

            if (job_item.bar_data == undefined) {           // draw 할 bar 정보가 없다면 정상적인 data 가 아닌것으로 본다.
                continue
            }

            // job 의 bar 이다. class 에 part id를 추가하여 hide, show 시 사용한다.
            var username = job_item.creator.username;
            if (job_item.worker != undefined && job_item.worker.username != undefined) {
                username = job_item.worker.username;
            }
            bar_html += `<div id="${job_item.documents_id}" class="bar ${COLOR_CSS[color_index]} hide ${id}" style="margin-left:${job_item.bar_data.left}px; width:${job_item.bar_data.width}px" onclick="clickJobBar(this)"><span class="fn-label">${username}</span></div>`;
        }

        bar_html += '</div>';

        $('.outline').append(bar_html);
    }

    // today line 을 추가한다.
    $('.outline').append(`<div id="today-bar" class="line today hide" style="margin-left:0px;height:0px"></div>`);
    drawTodayLine();
}

// wbs html 을 생성한다.
function createWBSHtmlData() {
    var _List = null;

    if (g_wbs_menu_type == 'project') {     // project wbs
        _List = g_wbsInfo.data.partList;
    } else {                                // user wbs     -- user 의 경우 part data 가 projectList 이름으로 넘어온다.
        _List = g_wbsInfo.data.projectList;
    }

    clearWBSView();                     // 화면 초기화
    createLeftPanel(_List);             // 왼쪽 메뉴 생성
    updateTableSize();                  // 메뉴 리스트에 따른 table height 업데이트
    createDatePanel();                  // 상단 날짜 관련 생성
    createBarHtml(_List);               // part의 job 관련 bar 생성
}

// WBS data 를 화면에 보여주기 시작 지점
function startWBSView() {
    console.log(`>>>>>>>>>> startWBSView ${g_wbs_menu_type}`, g_view_type, '<<<<<<<<<<');    // 시작 전에 menu type(project, user), view type(week, daily) 가 설정되어 있어야 한다.

    createSearchBaseRangeData();    // 상단 검색 기간에 해당하는 월, 주, 일 정보 표시에 해당하는 data 를 미리 준비해둔다.
    preSetViewTableIndex();         // part 와 job list 에 미리 draw 하기위한 table index, left, width 값을 설정한다.

    createWBSHtmlData();            // 앞쪽에서 data가 다 준비되었으면 기본 화면을 생성한다.
}


// -------------------------------------------------------------------------------------------------- // 

// mobile 에서 전달해온 정보를 분기처히한다.
function handleData(type, jsonObj) {
    //console.log(type, jsonObj)

    switch (type) {
        case 'collapse_txt': {
            var txt = jsonObj['collapse_txt'];
            $('#collapse-btn').text(txt)
        }
            break;
        case 'wbs_menu_type':               // project, user
            g_wbs_menu_type = jsonObj['wbs_menu_type'];
            console.log('g_wbs_menu_type =', g_wbs_menu_type);
            break;

        case 'view_type':                  // 현재 선택한 view type 이 넘어온다. week, daily
            g_view_type = jsonObj['view_type'];
            console.log('g_view_type =', g_view_type);
            break;

        case 'wbs_data':
            g_wbsInfo = jsonObj;            // project wbs 정보가 모바일에서 넘어온다.
            console.log('get wbs_data', JSON.stringify(g_wbsInfo));

            // 현재 선택한 view type 에 따라 table 을 생성한다.
            if (g_view_type == 'week') {
                selectWeekView();
            } else if (g_view_type == 'daily') {
                selectDailyView();
            } else {
                new Error("unknown view type", g_view_type)
            }

            break;

        case 'wbs_data_user':
            g_wbsInfo = jsonObj;            // project wbs 정보가 모바일에서 넘어온다.
            console.log('wbs_data_user', g_wbsInfo);

            // 현재 선택한 view type 에 따라 table 을 생성한다.
            if (g_view_type == 'week') {
                //createWeekViewWBS(jsonObj);
                selectWeekView();
            } else if (g_view_type == 'daily') {
                //createDailyViewWBS(jsonObj);
                selectDailyView();
            } else {
                new Error("unknown view type", g_view_type)
            }
            break;

        case 'contentHeight':
            var contentHeight = jsonObj['contentHeight'];
            if (contentHeight == 0) {
                return;
            }
            var btn_box_height = $('.btn-Box').height();
            var fixedHeight = contentHeight - btn_box_height - 24;
            console.log('fixedHeight =', fixedHeight);
            $('.fn-gantt .fn-content').height(fixedHeight);
            break;
    }
}

