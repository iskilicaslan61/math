/* Test ve sınav kâğıdı üretimi (tohumlu: her açılışta aynı sorular) */
(function (global) {
  'use strict';
  var TEST_COUNT = 5, TEST_SIZE = 6, EXAM_SIZE = 10, TEMA_EXAM_SIZE = 20;

  function build(week, seed, count, offset) {
    var rng = MC.makeRng(seed);
    var order = [], out = [], n = week.makers.length, guard = 0;
    while (out.length < count && guard++ < count * 5) {
      if (!order.length) order = rng.shuffle(week.makers.map(function (_, i) { return i; }));
      var idx = order.shift();
      try { var q = week.makers[idx](rng); q.maker = idx; q.week = week.no; out.push(q); }
      catch (e) { /* kötü bir tohum olursa bu maker atlanır */ if (global.QUIZ_DEBUG) throw e; }
    }
    return out;
  }
  function dedupe(list) {
    var seen = {}, out = [];
    list.forEach(function (q) { var k = q.q + '|' + q.opts.join('/'); if (!seen[k]) { seen[k] = 1; out.push(q); } });
    return out;
  }
  function buildTest(week, t) { return build(week, 'w' + week.no + '-test' + t, TEST_SIZE); }
  function buildExam(week) { return build(week, 'w' + week.no + '-exam', EXAM_SIZE); }
  function buildTemaExam(temaId) {
    var weeks = WEEKS.filter(function (w) { return w.tema === temaId; });
    var per = Math.ceil(TEMA_EXAM_SIZE / weeks.length);
    var all = [];
    weeks.forEach(function (w) { all = all.concat(build(w, 'tema' + temaId + '-exam-w' + w.no, per)); });
    var rng = MC.makeRng('tema' + temaId + '-mix');
    return rng.shuffle(all).slice(0, TEMA_EXAM_SIZE);
  }
  global.QZ = { buildTest: buildTest, buildExam: buildExam, buildTemaExam: buildTemaExam, TEST_COUNT: TEST_COUNT, TEST_SIZE: TEST_SIZE, EXAM_SIZE: EXAM_SIZE, TEMA_EXAM_SIZE: TEMA_EXAM_SIZE };
})(window);
