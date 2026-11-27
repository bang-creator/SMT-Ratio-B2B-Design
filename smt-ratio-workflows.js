// SMT Ratio — 4-Step Visual BA Workflow Engine (Modules A, B, C, BR-01..BR-11)
// Strictly uses canonical DS classes, tokenized styles, zero inline HTML style attributes, zero color literals.

const esc = (v) => String(v ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const nowStamp = () => {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `Today ${hh}:${mm}:${ss}`;
};

const STAGE_META = {
  pending_analysis: { label: 'Queued', badge: 'ds-badge--default', step: 1 },
  analyzing: { label: 'Analysing', badge: 'ds-badge--blue', step: 1 },
  undetermined: { label: 'Needs input', badge: 'ds-badge--red', step: 1 },
  pending_chart: { label: 'Select scenario', badge: 'ds-badge--purple', step: 1 },
  pending_report: { label: 'Validate evidence', badge: 'ds-badge--cyan', step: 2 },
  negotiating: { label: 'Negotiating', badge: 'ds-badge--orange', step: 3 },
  agreed: { label: 'Settled', badge: 'ds-badge--green', step: 4 },
  closed: { label: 'Closed', badge: 'ds-badge--neutral', step: 4 },
};

const ACTIVITY_CATEGORY_BADGES = {
  ANALYSIS: 'ds-badge--blue',
  REPORT: 'ds-badge--cyan',
  NEGO: 'ds-badge--orange',
  NOTIFY: 'ds-badge--green',
  CHAT: 'ds-badge--purple',
  OTHER: 'ds-badge--default',
};

export const POLICY_DIRECTORY = {
  'POL-2026-8801': { customerName: 'Minh Quan Nguyen', plate: '51K-892.41', vehicle: 'Hyundai Tucson 2024' },
  'POL-2026-7742': { customerName: 'Thu Ha Tran', plate: '30H-441.20', vehicle: 'Kia K5 GT-Line' },
  'POL-2026-9105': { customerName: 'Ji-hoon Park', plate: '12가 3456', vehicle: 'Genesis G80' },
  'POL-2026-6620': { customerName: 'Hoang Nam Le', plate: '43A-558.19', vehicle: 'Mazda CX-5' },
};

const KNIA_CHART_CATALOG = [
  {
    code: 'KNIA-205',
    short: 'Scenario 205',
    category: 'Signalized Intersection',
    title: 'Green straight vs late red cross-traffic',
    baseRatio: '20 : 80',
    insuredFault: 20,
    counterpartyFault: 80,
    simType: 'tbone_green',
    partyARole: 'Solid green straight',
    partyBRole: 'Late red cross-entry',
    fitByScenario: { 'Intersection T-bone': 92, 'Signal violation': 76 },
    criteria: ['Green stop-bar entry', 'Cross red +0.8s', 'Front-quarter broadside'],
    kniaProse: 'Applies at a signalized junction when Vehicle A {c205-1} and collides with cross-traffic Vehicle B that {c205-2}, causing {c205-3}.',
    kniaBasis: [
      { id: 'c205-1', highlight: 'enters straight on a solid green signal', time: '00:09.8', cam: 1, frame: 'F588', hud: 'Green entry', reticle: 'signal' },
      { id: 'c205-2', highlight: 'crosses the stop line late on red', time: '00:11.6', cam: 4, frame: 'F696', hud: 'Red +0.8s', reticle: 'signal' },
      { id: 'c205-3', highlight: 'broadside contact inside the intersection', time: '00:12.4', cam: 1, frame: 'F744', hud: 'Impact 2.8G', reticle: 'impact' },
    ],
    evidenceTemplate: [
      {
        id: 'e205-1',
        title: 'Signal approach corridor',
        supportText: 'Vehicle A enters the junction box under a solid green phase before cross-traffic appears.',
        conf: 96,
        type: 'range',
        startTime: '00:09.6',
        endTime: '00:11.2',
        cam: 1,
        hud: 'Green corridor',
        reticle: 'signal',
        keyframes: [
          { id: 'e205-1a', label: 'Green bar', time: '00:09.8', cam: 1, hud: 'Solid green entry', reticle: 'signal' },
          { id: 'e205-1b', label: 'Box entry', time: '00:10.8', cam: 1, hud: 'Mid-box hold', reticle: 'lane' },
        ],
      },
      {
        id: 'e205-2',
        title: 'Red-light cross entry',
        supportText: 'Cross-traffic B crosses the stop bar 0.8s after the red phase locks.',
        conf: 93,
        type: 'keyframe',
        time: '00:11.6',
        cam: 4,
        hud: 'Red +0.8s',
        reticle: 'signal',
      },
      {
        id: 'e205-3',
        title: 'Front-quarter impact',
        supportText: 'Peak 2.8G broadside contact aligns with baseline intersection geometry.',
        conf: 98,
        type: 'keyframe',
        time: '00:12.4',
        cam: 1,
        hud: 'Impact 2.8G',
        reticle: 'impact',
      },
    ],
    disputes: [
      {
        id: '분심위 2024-0412',
        title: 'Signal transition lateral hit',
        authority: 'KNIA Deliberation Committee',
        date: '2024-03-18',
        rulingRatio: '20 : 80',
        modifier: 'None (0%)',
        similarity: 0.89,
        favorability: 'favorable',
        facts: 'Insured entered a 4-lane junction on solid green at 42 km/h; cross-traffic entered 0.8s after red and struck the front fender.',
        summary: 'Maintained 80:20 baseline on confirmed green entry and sub-second reaction window.',
        relevance: 'Directly matches Cam 1 green entry and Cam 4 +0.8s red breach.',
      },
      {
        id: '분심위 2023-1890',
        title: 'Evening visibility overlap',
        authority: 'KNIA Deliberation Committee',
        date: '2023-11-06',
        rulingRatio: '30 : 70',
        modifier: '+10% speed excess',
        similarity: 0.52,
        favorability: 'favorable',
        facts: 'Dusk signal transition collision where straight vehicle exceeded urban speed limit by 26 km/h.',
        summary: 'Split adjusted only when straight vehicle exceeded posted limit by more than 20 km/h.',
        relevance: 'Confirms no upward fault modifier applies when approach speed stays within limit.',
      },
    ],
    precedents: [
      {
        id: 'Supreme Court 2022Da-4102',
        title: 'Green-signal trust principle',
        authority: 'Supreme Court of Korea',
        date: '2022-11-10',
        rulingRatio: '20 : 80',
        modifier: 'None (0%)',
        similarity: 0.84,
        favorability: 'favorable',
        facts: 'Through-driver proceeding on steady green collided with cross-traffic violating red phase.',
        summary: 'Drivers entering on solid green have no duty to anticipate late red-light violations absent visible hazard.',
        relevance: 'Supports rejecting counterparty claim of late evasive steering.',
      },
      {
        id: 'District Court 2021Ga-904',
        title: 'Excess speed contributory warning',
        authority: 'Seoul Central District Court',
        date: '2021-06-24',
        rulingRatio: '35 : 65',
        modifier: '+15% speed & lookout',
        similarity: 0.24,
        favorability: 'unfavorable',
        facts: 'Straight driver accelerated to 78 km/h in a 50 km/h zone entering a congested junction.',
        summary: 'Substantial speeding adds contributory fault despite green signal priority.',
        relevance: 'Distinguishable: insured approach speed here is verified within normal corridor flow.',
      },
    ],
  },
  {
    code: 'KNIA-203',
    short: 'Scenario 203',
    category: 'Signal Violation',
    title: 'Green straight vs explicit red-light runner',
    baseRatio: '10 : 90',
    insuredFault: 10,
    counterpartyFault: 90,
    simType: 'tbone_red',
    partyARole: 'Corridor right-of-way',
    partyBRole: 'Full red violation (>1.2s)',
    fitByScenario: { 'Signal violation': 94, 'Intersection T-bone': 74 },
    criteria: ['All-red entry >1.2s', 'Legal speed verified'],
    kniaProse: 'Applies when cross-traffic Vehicle B {c203-1} against an explicit red phase while Vehicle A {c203-2} with right-of-way.',
    kniaBasis: [
      { id: 'c203-1', highlight: 'enters more than 1.2s after red', time: '00:11.6', cam: 4, frame: 'F696', hud: 'Red +1.4s', reticle: 'signal' },
      { id: 'c203-2', highlight: 'proceeds straight through the corridor', time: '00:12.4', cam: 1, frame: 'F744', hud: 'Fender hit', reticle: 'impact' },
    ],
    evidenceTemplate: [
      {
        id: 'e203-1',
        title: 'All-red signal phase',
        supportText: 'Overhead CCTV confirms all-red clearance exceeded 1.2s prior to violation.',
        conf: 95,
        type: 'keyframe',
        time: '00:10.4',
        cam: 4,
        hud: 'All-red phase',
        reticle: 'signal',
      },
      {
        id: 'e203-2',
        title: 'Red-runner crossing window',
        supportText: 'Vehicle B clears the stop bar late on red and closes rapidly across lane 1.',
        conf: 96,
        type: 'range',
        startTime: '00:11.2',
        endTime: '00:12.4',
        cam: 4,
        hud: 'Red +1.4s sweep',
        reticle: 'signal',
        keyframes: [
          { id: 'e203-2a', label: 'Red cross', time: '00:11.6', cam: 4, hud: 'Red +1.4s', reticle: 'signal' },
          { id: 'e203-2b', label: 'Fender hit', time: '00:12.4', cam: 1, hud: 'Fender impact', reticle: 'impact' },
        ],
      },
      {
        id: 'e203-3',
        title: 'Straight right-of-way',
        supportText: 'Vehicle A keeps steady speed in the green corridor with <1.0s reaction gap.',
        conf: 97,
        type: 'keyframe',
        time: '00:12.0',
        cam: 1,
        hud: 'Straight green',
        reticle: 'lane',
      },
    ],
    disputes: [
      {
        id: '분심위 2024-1102',
        title: 'All-red clearance entry',
        authority: 'KNIA Deliberation Committee',
        date: '2024-06-12',
        rulingRatio: '10 : 90',
        modifier: '-10% explicit red',
        similarity: 0.91,
        favorability: 'favorable',
        facts: 'Overhead CCTV recorded cross-traffic entering 1.4s after red while insured held green right-of-way.',
        summary: 'Awarded 90:10 baseline when CCTV timestamp verified >1.2s all-red breach.',
        relevance: 'Matches Cam 4 +1.4s red clearance timestamp and legal corridor speed.',
      },
    ],
    precedents: [
      {
        id: 'High Court 2023Na-1182',
        title: 'Red-runner strict liability',
        authority: 'Seoul High Court',
        date: '2023-09-21',
        rulingRatio: '10 : 90',
        modifier: 'None (0%)',
        similarity: 0.88,
        favorability: 'favorable',
        facts: 'Corridor driver travelling within speed limit struck cross-traffic clearing red stop bar.',
        summary: 'Upheld 90:10 split because through-driver lacked realistic avoidance distance after red violation began.',
        relevance: 'Supports 90:10 posture when reaction gap is under 1.0s.',
      },
    ],
  },
  {
    code: 'KNIA-252',
    short: 'Scenario 252',
    category: 'Lane Change',
    title: 'Abrupt cut-in into occupied straight lane',
    baseRatio: '30 : 70',
    insuredFault: 30,
    counterpartyFault: 70,
    simType: 'lane_cutin',
    partyARole: 'Occupied straight lane',
    partyBRole: 'Abrupt unsafe merge',
    fitByScenario: { 'Lane change cut-in': 91, 'U-turn conflict': 44 },
    criteria: ['Adjacent lanes', 'Merge headway <1.5s'],
    kniaProse: 'Applies on multi-lane roads when Vehicle B {c252-1} without clearance while Vehicle A {c252-2}.',
    kniaBasis: [
      { id: 'c252-1', highlight: 'cuts across the dashed lane line', time: '00:11.2', cam: 1, frame: 'F672', hud: 'Cut-in', reticle: 'lane' },
      { id: 'c252-2', highlight: 'holds a steady straight lane', time: '00:12.4', cam: 3, frame: 'F744', hud: 'Sideswipe', reticle: 'impact' },
    ],
    evidenceTemplate: [
      {
        id: 'e252-1',
        title: 'Sudden lane-line cut-in',
        supportText: 'Vehicle B crosses the dashed divider with under 1.5s headway and no signal.',
        conf: 92,
        type: 'range',
        startTime: '00:10.6',
        endTime: '00:12.2',
        cam: 1,
        hud: 'Cut-in <1.5s',
        reticle: 'lane',
        keyframes: [
          { id: 'e252-1a', label: 'Line touch', time: '00:11.0', cam: 1, hud: 'Dashed cross', reticle: 'lane' },
          { id: 'e252-1b', label: 'Close merge', time: '00:11.8', cam: 3, hud: 'Gap <1.0s', reticle: 'lane' },
        ],
      },
      {
        id: 'e252-2',
        title: 'Insured lane position',
        supportText: 'Vehicle A remains centered within lane 2 prior to lateral encroachment.',
        conf: 94,
        type: 'keyframe',
        time: '00:10.2',
        cam: 1,
        hud: 'Lane-2 centered',
        reticle: 'lane',
      },
      {
        id: 'e252-3',
        title: 'Lateral sideswipe contact',
        supportText: 'Right front bumper meets left quarter panel inside the straight lane.',
        conf: 95,
        type: 'keyframe',
        time: '00:12.4',
        cam: 3,
        hud: 'Sideswipe hit',
        reticle: 'impact',
      },
    ],
    disputes: [
      {
        id: '분심위 2024-0774',
        title: 'Unsignaled arterial cut-in',
        authority: 'KNIA Deliberation Committee',
        date: '2024-04-29',
        rulingRatio: '20 : 80',
        modifier: '+10% no turn blinker',
        similarity: 0.82,
        favorability: 'favorable',
        facts: 'Merging car crossed dashed divider under 1.5s headway without activating turn indicator.',
        summary: 'Added 10% fault to merging vehicle when 30m signal prior to lane change was absent.',
        relevance: 'Supports insured -10% modifier if inactive blinker frame holds.',
      },
    ],
    precedents: [
      {
        id: 'District Court 2022Na-3321',
        title: 'Multi-lane blind-spot duty',
        authority: 'Seoul Central District Court',
        date: '2022-08-19',
        rulingRatio: '30 : 70',
        modifier: 'None (0%)',
        similarity: 0.78,
        favorability: 'favorable',
        facts: 'Trailing adjacent vehicle merged suddenly into occupied lane during moderate arterial flow.',
        summary: 'Straight-lane driver retains priority unless deliberately accelerating to block merge.',
        relevance: 'Counters counterparty claim of sudden acceleration inside lane 2.',
      },
    ],
  },
  {
    code: 'KNIA-401',
    short: 'Scenario 401',
    category: 'Rear-End Collision',
    title: 'Trailing impact into stationary lead car',
    baseRatio: '0 : 100',
    insuredFault: 0,
    counterpartyFault: 100,
    simType: 'rear_end',
    partyARole: 'Stationary queue (>2.0s)',
    partyBRole: 'Failed safe following distance',
    fitByScenario: { 'Rear-end collision': 95 },
    criteria: ['Lead stopped >2.0s', 'No sudden braking'],
    kniaProse: 'Applies when lead Vehicle A {c401-1} at a signal or queue and trailing Vehicle B {c401-2} without maintaining safe distance.',
    kniaBasis: [
      { id: 'c401-1', highlight: 'remains fully stopped in lane', time: '00:09.8', cam: 2, frame: 'F588', hud: 'Stopped 0 km/h', reticle: 'rear' },
      { id: 'c401-2', highlight: 'strikes the rear bumper at speed', time: '00:12.4', cam: 2, frame: 'F744', hud: 'Rear impact', reticle: 'impact' },
    ],
    evidenceTemplate: [
      {
        id: 'e401-1',
        title: 'Stationary queue hold',
        supportText: 'Vehicle A stays halted at 0 km/h for over 2.0s with no erratic stop.',
        conf: 99,
        type: 'range',
        startTime: '00:09.6',
        endTime: '00:11.6',
        cam: 2,
        hud: 'Stopped >2.0s',
        reticle: 'rear',
        keyframes: [
          { id: 'e401-1a', label: 'Queue halt', time: '00:09.8', cam: 2, hud: '0 km/h queue', reticle: 'rear' },
          { id: 'e401-1b', label: 'Hold steady', time: '00:11.2', cam: 2, hud: 'Brake lights on', reticle: 'rear' },
        ],
      },
      {
        id: 'e401-2',
        title: 'Delayed trailing closure',
        supportText: 'Rear feed shows Vehicle B maintaining 46 km/h inside minimum stopping distance.',
        conf: 96,
        type: 'keyframe',
        time: '00:11.8',
        cam: 2,
        hud: 'Closing 46 km/h',
        reticle: 'rear',
      },
      {
        id: 'e401-3',
        title: 'Direct rear-end impact',
        supportText: 'Full-width rear bumper contact aligns cleanly with KNIA-401 baseline.',
        conf: 98,
        type: 'keyframe',
        time: '00:12.4',
        cam: 2,
        hud: 'Rear impact',
        reticle: 'impact',
      },
    ],
    disputes: [
      {
        id: '분심위 2024-0209',
        title: 'Queue standstill rear hit',
        authority: 'KNIA Deliberation Committee',
        date: '2024-02-14',
        rulingRatio: '0 : 100',
        modifier: 'None (0%)',
        similarity: 0.94,
        favorability: 'favorable',
        facts: 'Lead car remained stopped at 0 km/h in signal queue for 2.4s before trailing impact.',
        summary: 'Assigned full 100:0 liability to trailing driver when rear camera confirmed uninterrupted standstill.',
        relevance: 'Directly aligns with Cam 2 queue halt evidence.',
      },
    ],
    precedents: [
      {
        id: 'Supreme Court 2021Da-7780',
        title: 'Safe following distance duty',
        authority: 'Supreme Court of Korea',
        date: '2021-10-14',
        rulingRatio: '0 : 100',
        modifier: 'None (0%)',
        similarity: 0.9,
        favorability: 'favorable',
        facts: 'Trailing vehicle failed to brake in time behind lead vehicle stopped legally at red light.',
        summary: 'Stopped lead vehicle owes zero fault absent sudden unnecessary emergency braking.',
        relevance: 'Reinforces 100:0 baseline against comparative lookout claims.',
      },
    ],
  },
  {
    code: 'KNIA-221',
    short: 'Scenario 221',
    category: 'Unprotected Left Turn',
    title: 'Permissive left turn vs oncoming straight',
    baseRatio: '40 : 60',
    insuredFault: 40,
    counterpartyFault: 60,
    simType: 'left_turn',
    partyARole: 'Oncoming straight priority',
    partyBRole: 'Permissive left turn yield duty',
    fitByScenario: { 'Unprotected left turn': 86, 'Intersection T-bone': 48 },
    criteria: ['Permissive green', 'Oncoming straight priority'],
    kniaProse: 'Applies when a left-turning vehicle enters on {c221-1} and fails to yield to oncoming traffic, resulting in {c221-2}.',
    kniaBasis: [
      { id: 'c221-1', highlight: 'permissive green without a turn arrow', time: '00:11.0', cam: 1, frame: 'F660', hud: 'Permissive', reticle: 'turn' },
      { id: 'c221-2', highlight: 'oblique contact in the center box', time: '00:12.4', cam: 4, frame: 'F744', hud: 'Turn impact', reticle: 'impact' },
    ],
    evidenceTemplate: [
      {
        id: 'e221-1',
        title: 'Permissive green signal',
        supportText: 'Overhead signal confirms permissive green with no protected left-turn arrow.',
        conf: 91,
        type: 'keyframe',
        time: '00:10.4',
        cam: 1,
        hud: 'Permissive green',
        reticle: 'turn',
      },
      {
        id: 'e221-2',
        title: 'Unprotected turn arc',
        supportText: 'Turning vehicle sweeps across oncoming lane 2 without clearing straight traffic.',
        conf: 89,
        type: 'range',
        startTime: '00:11.0',
        endTime: '00:12.4',
        cam: 4,
        hud: 'Left turn arc',
        reticle: 'turn',
        keyframes: [
          { id: 'e221-2a', label: 'Turn start', time: '00:11.2', cam: 1, hud: 'Cross centerline', reticle: 'turn' },
          { id: 'e221-2b', label: 'Center hit', time: '00:12.4', cam: 4, hud: 'Turn impact', reticle: 'impact' },
        ],
      },
      {
        id: 'e221-3',
        title: 'Oncoming corridor priority',
        supportText: 'Straight vehicle holds right-of-way inside center box prior to oblique hit.',
        conf: 94,
        type: 'keyframe',
        time: '00:12.0',
        cam: 1,
        hud: 'Oncoming straight',
        reticle: 'lane',
      },
    ],
    disputes: [
      {
        id: '분심위 2024-0551',
        title: '3-lane boulevard left turn',
        authority: 'KNIA Deliberation Committee',
        date: '2024-04-03',
        rulingRatio: '40 : 60',
        modifier: 'Speed check (0%)',
        similarity: 0.75,
        favorability: 'neutral',
        facts: 'Left-turning vehicle entered permissive green and struck oncoming straight car.',
        summary: 'Maintained 60:40 split unless oncoming speed exceeded 20 km/h above corridor limit.',
        relevance: 'Indicates straight speed verification protects against adverse modifier.',
      },
    ],
    precedents: [
      {
        id: 'District Court 2023Ga-4019',
        title: 'Permissive left yield duty',
        authority: 'Seoul Southern District Court',
        date: '2023-07-11',
        rulingRatio: '30 : 70',
        modifier: '+10% wide turn arc',
        similarity: 0.72,
        favorability: 'favorable',
        facts: 'Turning vehicle commenced turn without waiting for oncoming through-lanes to clear.',
        summary: 'Turning driver must yield across all oncoming lanes on unprotected green.',
        relevance: 'Supports holding turning counterparty primarily liable.',
      },
    ],
  },
  {
    code: 'KNIA-263',
    short: 'Scenario 263',
    category: 'Roundabout Merge',
    title: 'Entering vs circulating in rotary',
    baseRatio: '50 : 50',
    insuredFault: 50,
    counterpartyFault: 50,
    simType: 'roundabout',
    partyARole: 'Outer rotary lane',
    partyBRole: 'Concurrent entry merge',
    fitByScenario: { 'Roundabout merge': 84 },
    criteria: ['Concurrent rotary overlap'],
    kniaProse: 'Applies at a multi-lane roundabout when an entering vehicle and a circulating vehicle create {c263-1} across the yield line.',
    kniaBasis: [
      { id: 'c263-1', highlight: 'concurrent merge overlap', time: '00:12.0', cam: 1, frame: 'F720', hud: 'Rotary merge', reticle: 'lane' },
    ],
    evidenceTemplate: [
      {
        id: 'e263-1',
        title: 'Yield line entry',
        supportText: 'Entering vehicle crosses rotary yield markings while outer circle traffic approaches.',
        conf: 86,
        type: 'keyframe',
        time: '00:10.6',
        cam: 1,
        hud: 'Yield crossing',
        reticle: 'lane',
      },
      {
        id: 'e263-2',
        title: 'Concurrent rotary merge',
        supportText: 'Both trajectories converge inside the outer rotary lane over a 1.6s window.',
        conf: 88,
        type: 'range',
        startTime: '00:10.8',
        endTime: '00:12.4',
        cam: 4,
        hud: 'Rotary overlap',
        reticle: 'lane',
        keyframes: [
          { id: 'e263-2a', label: 'Converge', time: '00:11.4', cam: 1, hud: 'Lane convergence', reticle: 'lane' },
          { id: 'e263-2b', label: 'Merge hit', time: '00:12.4', cam: 4, hud: 'Rotary contact', reticle: 'impact' },
        ],
      },
      {
        id: 'e263-3',
        title: 'Circulating lateral gap',
        supportText: 'Closing speed delta remains low during parallel rotary travel.',
        conf: 85,
        type: 'keyframe',
        time: '00:12.0',
        cam: 1,
        hud: 'Parallel squeeze',
        reticle: 'lane',
      },
    ],
    disputes: [
      {
        id: '분심위 2023-2140',
        title: '2-lane rotary sweep overlap',
        authority: 'KNIA Deliberation Committee',
        date: '2023-12-08',
        rulingRatio: '50 : 50',
        modifier: 'None (0%)',
        similarity: 0.79,
        favorability: 'neutral',
        facts: 'Entering and circulating vehicles entered the outer rotary lane within 0.4s across yield markings.',
        summary: 'Applied balanced 50:50 baseline when both vehicles shared simultaneous merge timing.',
        relevance: 'Matches concurrent overlap observed across yield window.',
      },
    ],
    precedents: [
      {
        id: 'District Court 2022Na-6190',
        title: 'Circulating rotary yield priority',
        authority: 'Incheon District Court',
        date: '2022-05-19',
        rulingRatio: '40 : 60',
        modifier: '+10% yield violation',
        similarity: 0.76,
        favorability: 'favorable',
        facts: 'Vehicle already circulating inside rotary collided with car crossing yield line late.',
        summary: 'Entry drivers owe heightened yield duty once circulating car is visibly established.',
        relevance: 'Provides leverage to shift 10% if rotary occupancy precedes entry.',
      },
    ],
  },
  {
    code: 'KNIA-246',
    short: 'Scenario 246',
    category: 'U-Turn Conflict',
    title: 'Permitted U-turn sweep vs straight lane',
    baseRatio: '20 : 80',
    insuredFault: 20,
    counterpartyFault: 80,
    simType: 'uturn',
    partyARole: 'Opposing straight lane',
    partyBRole: 'Wide U-turn sweep',
    fitByScenario: { 'U-turn conflict': 88 },
    criteria: ['Wide U-turn across lanes'],
    kniaProse: 'Applies at a permitted U-turn zone when Vehicle B {c246-1} and encroaches on oncoming lanes, causing {c246-2}.',
    kniaBasis: [
      { id: 'c246-1', highlight: 'makes a wide U-turn sweep', time: '00:11.6', cam: 1, frame: 'F696', hud: 'U-turn arc', reticle: 'turn' },
      { id: 'c246-2', highlight: 'contact inside the straight travel lane', time: '00:12.4', cam: 4, frame: 'F744', hud: 'Lane-2 hit', reticle: 'impact' },
    ],
    evidenceTemplate: [
      {
        id: 'e246-1',
        title: 'Permitted U-turn bay entry',
        supportText: 'Counterparty initiates turn from designated U-turn pocket prior to swing.',
        conf: 90,
        type: 'keyframe',
        time: '00:10.4',
        cam: 4,
        hud: 'U-turn pocket',
        reticle: 'turn',
      },
      {
        id: 'e246-2',
        title: 'Wide U-turn sweep arc',
        supportText: 'Vehicle B overshoots the inner turning radius and sweeps into lane 2.',
        conf: 92,
        type: 'range',
        startTime: '00:11.0',
        endTime: '00:12.4',
        cam: 1,
        hud: 'Wide sweep arc',
        reticle: 'turn',
        keyframes: [
          { id: 'e246-2a', label: 'Wide arc', time: '00:11.6', cam: 1, hud: 'Lane-2 encroach', reticle: 'turn' },
          { id: 'e246-2b', label: 'Lane-2 hit', time: '00:12.4', cam: 4, hud: 'U-turn impact', reticle: 'impact' },
        ],
      },
      {
        id: 'e246-3',
        title: 'Opposing straight speed',
        supportText: 'Insured maintains steady straight velocity through opposing lane 2.',
        conf: 95,
        type: 'keyframe',
        time: '00:12.0',
        cam: 1,
        hud: 'Opposing straight',
        reticle: 'lane',
      },
    ],
    disputes: [
      {
        id: '분심위 2024-0631',
        title: 'Wide U-turn into outer lane 2',
        authority: 'KNIA Deliberation Committee',
        date: '2024-04-16',
        rulingRatio: '20 : 80',
        modifier: 'None (0%)',
        similarity: 0.9,
        favorability: 'favorable',
        facts: 'Permitted U-turn vehicle swung wide across lane 1 and entered opposing lane 2 directly into traffic.',
        summary: 'Upheld 80:20 baseline due to unyielded opposing sweep radius despite valid U-turn sign.',
        relevance: 'Directly supports Scenario 246 upgrade verified via CCTV.',
      },
    ],
    precedents: [
      {
        id: 'High Court 2022Na-5084',
        title: 'Permitted U-turn opposing yield duty',
        authority: 'Seoul High Court',
        date: '2022-10-07',
        rulingRatio: '20 : 80',
        modifier: 'None (0%)',
        similarity: 0.83,
        favorability: 'favorable',
        facts: 'U-turning sedan crossed two opposing lanes without confirming clear oncoming corridor.',
        summary: 'Allowed U-turn signage does not diminish duty to yield to oncoming straight traffic.',
        relevance: 'Confirms straight-corridor priority over U-turn sweep.',
      },
    ],
  },
  {
    code: 'KNIA-504',
    short: 'Scenario 504',
    category: 'Parking Deck',
    title: 'Bay reverse egress vs parking aisle',
    baseRatio: '70 : 30',
    insuredFault: 70,
    counterpartyFault: 30,
    simType: 'parking_back',
    partyARole: 'Reversing out of bay',
    partyBRole: 'Main parking aisle',
    fitByScenario: { 'Parking lot backing': 82 },
    criteria: ['Bay reverse egress'],
    kniaProse: 'Applies in off-street parking facilities when Vehicle A {c504-1} and collides with an approaching vehicle in {c504-2}.',
    kniaBasis: [
      { id: 'c504-1', highlight: 'reverses out of a parking bay', time: '00:11.5', cam: 2, frame: 'F690', hud: 'Reverse bay', reticle: 'rear' },
      { id: 'c504-2', highlight: 'the active main aisle', time: '00:12.4', cam: 4, frame: 'F744', hud: 'Aisle hit', reticle: 'impact' },
    ],
    evidenceTemplate: [
      {
        id: 'e504-1',
        title: 'Reverse parking egress',
        supportText: 'Vehicle A begins backing out of the marked stall into the main parking aisle.',
        conf: 89,
        type: 'range',
        startTime: '00:10.6',
        endTime: '00:12.2',
        cam: 2,
        hud: 'Reverse egress',
        reticle: 'rear',
        keyframes: [
          { id: 'e504-1a', label: 'Bay exit', time: '00:10.8', cam: 2, hud: 'Clear stall line', reticle: 'rear' },
          { id: 'e504-1b', label: 'Aisle entry', time: '00:11.8', cam: 4, hud: 'Enter main aisle', reticle: 'rear' },
        ],
      },
      {
        id: 'e504-2',
        title: 'Approaching aisle traffic',
        supportText: 'Overhead lot CCTV tracks Vehicle B traveling down the active drive aisle.',
        conf: 90,
        type: 'keyframe',
        time: '00:11.5',
        cam: 4,
        hud: 'Aisle approach',
        reticle: 'lane',
      },
      {
        id: 'e504-3',
        title: 'Rear-quarter aisle contact',
        supportText: 'Impact occurs with rear overhang angled into the main aisle corridor.',
        conf: 92,
        type: 'keyframe',
        time: '00:12.4',
        cam: 4,
        hud: 'Aisle contact',
        reticle: 'impact',
      },
    ],
    disputes: [
      {
        id: '분심위 2023-2418',
        title: 'Perpendicular stall reverse egress',
        authority: 'KNIA Deliberation Committee',
        date: '2023-12-19',
        rulingRatio: '70 : 30',
        modifier: 'None (0%)',
        similarity: 0.87,
        favorability: 'neutral',
        facts: 'Vehicle backed out of perpendicular bay into basement parking aisle while car passed.',
        summary: 'Maintained 30:70 off-street bay baseline when reverse egress entered active aisle.',
        relevance: 'Directly mirrors underground bay egress posture under Scenario 504.',
      },
    ],
    precedents: [
      {
        id: 'District Court 2022Ga-7310',
        title: 'Off-street aisle speed lookout duty',
        authority: 'Seoul Eastern District Court',
        date: '2022-07-08',
        rulingRatio: '60 : 40',
        modifier: '-10% aisle excess speed',
        similarity: 0.79,
        favorability: 'favorable',
        facts: 'Aisle vehicle exceeded 15 km/h indoor speed limit past blind pillar corners.',
        summary: 'Excessive aisle speed shifts 10% comparative fault onto straight-moving garage driver.',
        relevance: 'Supports modifier argument if aisle speed exceeded garage safety limit.',
      },
    ],
  },
  {
    code: 'KNIA-102',
    short: 'Scenario 102',
    category: 'Crosswalk',
    title: 'Right turn vs marked crosswalk',
    baseRatio: '90 : 10',
    insuredFault: 90,
    counterpartyFault: 10,
    simType: 'crosswalk',
    partyARole: 'Right turn across crosswalk',
    partyBRole: 'Pedestrian in crosswalk',
    fitByScenario: {},
    criteria: ['Marked crosswalk turn'],
    kniaProse: 'Applies when a turning vehicle makes a {c102-1} while pedestrians have active crossing priority.',
    kniaBasis: [
      { id: 'c102-1', highlight: 'right turn across a marked crosswalk', time: '00:12.4', cam: 1, frame: 'F744', hud: 'Crosswalk', reticle: 'turn' },
    ],
    evidenceTemplate: [
      {
        id: 'e102-1',
        title: 'Marked crosswalk priority',
        supportText: 'Pedestrian signal active as turning vehicle approaches crosswalk stripe.',
        conf: 92,
        type: 'keyframe',
        time: '00:10.8',
        cam: 1,
        hud: 'Crosswalk active',
        reticle: 'turn',
      },
      {
        id: 'e102-2',
        title: 'Crosswalk turn encroachment',
        supportText: 'Vehicle completes right-turn sweep across the occupied pedestrian crossing zone.',
        conf: 94,
        type: 'range',
        startTime: '00:11.4',
        endTime: '00:12.4',
        cam: 1,
        hud: 'Crosswalk turn',
        reticle: 'turn',
        keyframes: [
          { id: 'e102-2a', label: 'Turn arc', time: '00:11.6', cam: 1, hud: 'Crosswalk entry', reticle: 'turn' },
          { id: 'e102-2b', label: 'Contact', time: '00:12.4', cam: 4, hud: 'Crosswalk contact', reticle: 'impact' },
        ],
      },
      {
        id: 'e102-3',
        title: 'Pedestrian path overlap',
        supportText: 'Overhead view confirms pedestrian inside marked crosswalk prior to contact.',
        conf: 91,
        type: 'keyframe',
        time: '00:12.1',
        cam: 4,
        hud: 'Walkway overlap',
        reticle: 'impact',
      },
    ],
    disputes: [
      {
        id: '분심위 2024-0188',
        title: 'Right turn across active walk phase',
        authority: 'KNIA Deliberation Committee',
        date: '2024-02-02',
        rulingRatio: '90 : 10',
        modifier: '+10% crosswalk duty',
        similarity: 0.91,
        favorability: 'unfavorable',
        facts: 'Turning vehicle swept across marked crosswalk without coming to a full stop.',
        summary: 'Upheld strict 90:10 motorist fault when pedestrian walk phase was active.',
        relevance: 'Applies statutory right-turn yield standard under Road Traffic Act.',
      },
    ],
    precedents: [
      {
        id: 'Supreme Court 2023Da-2291',
        title: 'Reinforced crosswalk stop-and-yield duty',
        authority: 'Supreme Court of Korea',
        date: '2023-08-31',
        rulingRatio: '90 : 10',
        modifier: 'None (0%)',
        similarity: 0.88,
        favorability: 'unfavorable',
        facts: 'Right-turning SUV contacted pedestrian crossing inside striped lines on green walk signal.',
        summary: 'Motorists turning right must halt prior to crosswalk whenever a pedestrian is crossing or about to cross.',
        relevance: 'Defines non-negotiable baseline protection for pedestrians in marked crosswalks.',
      },
    ],
  },
  {
    code: 'KNIA-208',
    short: 'Scenario 208',
    category: 'Uncontrolled Junction',
    title: 'Equal unsignalized intersection conflict',
    baseRatio: '40 : 60',
    insuredFault: 40,
    counterpartyFault: 60,
    simType: 'uncontrolled',
    partyARole: 'Right-approach priority',
    partyBRole: 'Left-approach unsignalized',
    fitByScenario: { 'Intersection T-bone': 55, 'Unprotected left turn': 38 },
    criteria: ['Unsignalized equal junction'],
    kniaProse: 'Applies at equal-width unsignalized roads with {c208-1} where the right-side approach holds priority prior to {c208-2}.',
    kniaBasis: [
      { id: 'c208-1', highlight: 'simultaneous blind-corner entry', time: '00:10.5', cam: 1, frame: 'F630', hud: 'Blind corner', reticle: 'lane' },
      { id: 'c208-2', highlight: 'broadside junction contact', time: '00:12.4', cam: 4, frame: 'F744', hud: 'Junction hit', reticle: 'impact' },
    ],
    evidenceTemplate: [
      {
        id: 'e208-1',
        title: 'Equal junction signage',
        supportText: 'Approaching lanes match in width with no signal control at the box.',
        conf: 82,
        type: 'keyframe',
        time: '00:10.2',
        cam: 4,
        hud: 'Unsignalized box',
        reticle: 'lane',
      },
      {
        id: 'e208-2',
        title: 'Blind-corner convergence',
        supportText: 'Both vehicles enter the intersection simultaneously across restricted sightlines.',
        conf: 78,
        type: 'range',
        startTime: '00:10.5',
        endTime: '00:12.2',
        cam: 1,
        hud: 'Blind convergence',
        reticle: 'lane',
        keyframes: [
          { id: 'e208-2a', label: 'Blind entry', time: '00:10.6', cam: 1, hud: 'Simultaneous entry', reticle: 'lane' },
          { id: 'e208-2b', label: 'Right priority', time: '00:11.8', cam: 4, hud: 'Right approach', reticle: 'lane' },
        ],
      },
      {
        id: 'e208-3',
        title: 'Center-box broadside contact',
        supportText: 'Lateral impact point reflects unyielded right-side junction priority.',
        conf: 84,
        type: 'keyframe',
        time: '00:12.4',
        cam: 4,
        hud: 'Junction hit',
        reticle: 'impact',
      },
    ],
    disputes: [
      {
        id: '분심위 2023-1504',
        title: 'Equal-width blind junction entry',
        authority: 'KNIA Deliberation Committee',
        date: '2023-09-14',
        rulingRatio: '40 : 60',
        modifier: 'None (0%)',
        similarity: 0.81,
        favorability: 'favorable',
        facts: 'Two vehicles entered an unsignalized equal-width intersection simultaneously around a corner wall.',
        summary: 'Awarded 60:40 priority to the right-side approach under equal-junction right-of-way.',
        relevance: 'Fallback reference when signal phase telemetry is unavailable.',
      },
    ],
    precedents: [
      {
        id: 'District Court 2021Na-8820',
        title: 'Statutory right-side priority at crossroads',
        authority: 'Seoul Central District Court',
        date: '2021-12-03',
        rulingRatio: '40 : 60',
        modifier: 'None (0%)',
        similarity: 0.77,
        favorability: 'favorable',
        facts: 'Simultaneous entry on residential two-lane crossroads with obstructed building corner.',
        summary: 'Right-approach vehicle holds priority where street widths match and no traffic signs govern entry.',
        relevance: 'Supports right-of-way split if junction is confirmed unsignalized.',
      },
    ],
  },
];

const getChartDefaultEvSig = (chartCode) => {
  const ch = KNIA_CHART_CATALOG.find((x) => x.code === (chartCode || 'KNIA-205')) || KNIA_CHART_CATALOG[0];
  return `${ch.code}:${(ch.evidenceTemplate || []).map((e, idx) => e.id || idx).join(',')}`;
};

const getActivityCategoryBadge = (type) => ACTIVITY_CATEGORY_BADGES[String(type || '').toUpperCase()] || 'ds-badge--default';

const SIMILAR_RESOLVED_CASES = {
  'KNIA-205': [
    { caseId: 'CASE-2026-0119', title: 'Gangnam Station late-red broadside', similarity: 0.94, baseRatio: '20 : 80', settledRatio: '10 : 90', disposition: 'Mutual settlement', resolvedDate: '2026-10-28', appliedModifiers: 'Counterparty red +10% (confirmed CCTV breach)', summary: 'Overhead signal log proved cross-traffic cleared stop bar 0.9s into red phase; counterparty accepted 10:90.' },
    { caseId: 'CASE-2026-0084', title: 'Teheran-ro dusk signal transition hit', similarity: 0.87, baseRatio: '20 : 80', settledRatio: '20 : 80', disposition: 'KNIA dispute committee', resolvedDate: '2026-09-14', appliedModifiers: 'None (0%)', summary: 'Maintained 20:80 baseline after dashcam verified steady speed at 44 km/h in 50 zone.' },
    { caseId: 'CASE-2025-0741', title: 'Yeoksam 4-lane green corridor impact', similarity: 0.79, baseRatio: '20 : 80', settledRatio: '25 : 75', disposition: 'Mutual settlement', resolvedDate: '2025-12-09', appliedModifiers: 'Insured +5% obstructed pillar view', summary: 'Small upward insured adjustment accepted where parked delivery van delayed cross-traffic detection.' },
  ],
  'KNIA-203': [
    { caseId: 'CASE-2026-0102', title: 'Banpo arterial full-red runner collision', similarity: 0.95, baseRatio: '10 : 90', settledRatio: '0 : 100', disposition: 'Mutual settlement', resolvedDate: '2026-10-11', appliedModifiers: 'Counterparty +10% extreme >1.5s red breach', summary: 'All-red clearance exceeded 1.5s with <0.6s reaction window; zero fault upheld on straight driver.' },
    { caseId: 'CASE-2026-0061', title: 'Jamsil wide junction red violation', similarity: 0.89, baseRatio: '10 : 90', settledRatio: '10 : 90', disposition: 'KNIA dispute committee', resolvedDate: '2026-08-19', appliedModifiers: 'None (0%)', summary: 'CCTV timestamp locked 1.3s all-red breach and legal corridor velocity.' },
  ],
  'KNIA-252': [
    { caseId: 'CASE-2026-0126', title: 'Olympic-daero unsignaled lateral cut-in', similarity: 0.92, baseRatio: '30 : 70', settledRatio: '20 : 80', disposition: 'Mutual settlement', resolvedDate: '2026-11-02', appliedModifiers: 'Counterparty +10% no turn signal', summary: 'Cam 1 frames confirmed inactive indicator across 18 frames prior to lane line cross.' },
    { caseId: 'CASE-2026-0073', title: 'Apgujeong expressway merge pinch', similarity: 0.84, baseRatio: '30 : 70', settledRatio: '30 : 70', disposition: 'Mutual settlement', resolvedDate: '2026-08-30', appliedModifiers: 'Baseline confirmed', summary: 'Both parties accepted standard 30:70 lane-change cut-in allocation without speed modifiers.' },
  ],
  'KNIA-401': [
    { caseId: 'CASE-2026-0110', title: 'Inner-ring standstill queue rear hit', similarity: 0.96, baseRatio: '0 : 100', settledRatio: '0 : 100', disposition: 'Mutual settlement', resolvedDate: '2026-10-20', appliedModifiers: 'None (0%)', summary: 'Brake lamps active 4.1s before contact; 100% trailing fault closed immediately.' },
    { caseId: 'CASE-2025-0912', title: 'Signal stop abrupt-brake dispute', similarity: 0.82, baseRatio: '0 : 100', settledRatio: '10 : 90', disposition: 'KNIA dispute committee', resolvedDate: '2025-11-18', appliedModifiers: 'Insured +10% unannounced stop check', summary: 'Committee assigned 10% only because lead vehicle stopped cleanly on flashing yellow without hazard.' },
  ],
  'KNIA-221': [
    { caseId: 'CASE-2026-0095', title: 'Mapo permissive green left turn', similarity: 0.91, baseRatio: '40 : 60', settledRatio: '35 : 65', disposition: 'Mutual settlement', resolvedDate: '2026-09-29', appliedModifiers: 'Counterparty +5% crossing speed', summary: 'Oncoming straight maintained green lane while left-turner crossed without gap clearance.' },
    { caseId: 'CASE-2025-0863', title: 'Hongdae multi-lane left-turn conflict', similarity: 0.85, baseRatio: '40 : 60', settledRatio: '40 : 60', disposition: 'KNIA dispute committee', resolvedDate: '2025-11-02', appliedModifiers: 'None (0%)', summary: 'Straight priority preserved at 40:60 under steady yellow-transition window.' },
  ],
  'KNIA-263': [
    { caseId: 'CASE-2026-0108', title: 'Seongsu rotary circulating priority', similarity: 0.9, baseRatio: '50 : 50', settledRatio: '40 : 60', disposition: 'Mutual settlement', resolvedDate: '2026-10-16', appliedModifiers: 'Counterparty +10% yield-line breach', summary: 'Circulating vehicle occupied inner lane 1.8s prior to entering vehicle crossing yield markings.' },
    { caseId: 'CASE-2025-0798', title: 'Rotary simultaneous two-lane merge', similarity: 0.81, baseRatio: '50 : 50', settledRatio: '50 : 50', disposition: 'Mutual settlement', resolvedDate: '2025-10-08', appliedModifiers: 'Baseline confirmed', summary: 'Equal comparative fault applied due to simultaneous lateral convergence.' },
  ],
  'KNIA-246': [
    { caseId: 'CASE-2026-0088', title: 'Seocho wide-median U-turn conflict', similarity: 0.91, baseRatio: '20 : 80', settledRatio: '20 : 80', disposition: 'Mutual settlement', resolvedDate: '2026-09-22', appliedModifiers: 'None (0%)', summary: 'U-turning party yielded poorly to far-lane straight traffic; 20:80 upheld.' },
    { caseId: 'CASE-2025-0820', title: 'Signalized U-turn outer-lane encroachment', similarity: 0.83, baseRatio: '20 : 80', settledRatio: '15 : 85', disposition: 'KNIA dispute committee', resolvedDate: '2025-10-25', appliedModifiers: 'Counterparty +5% wide turn sweep', summary: 'Swing-out into lane 2 added 5% counterparty responsibility.' },
  ],
  'KNIA-504': [
    { caseId: 'CASE-2026-0091', title: 'COEX underground bay backing impact', similarity: 0.93, baseRatio: '70 : 30', settledRatio: '70 : 30', disposition: 'Mutual settlement', resolvedDate: '2026-09-25', appliedModifiers: 'None (0%)', summary: 'Reversing vehicle bears primary lookout duty against aisle traffic.' },
    { caseId: 'CASE-2025-0774', title: 'Department store aisle reverse contact', similarity: 0.85, baseRatio: '70 : 30', settledRatio: '75 : 25', disposition: 'Mutual settlement', resolvedDate: '2025-09-30', appliedModifiers: 'Insured +5% continuous backing', summary: 'Reverse gear engaged continuously despite approaching headlights in aisle mirror.' },
  ],
};

const getSimilarResolvedCases = (chart) => {
  const code = chart?.code;
  if (code && SIMILAR_RESOLVED_CASES[code]) return SIMILAR_RESOLVED_CASES[code];
  const base = chart?.baseRatio || '20 : 80';
  return [
    {
      caseId: 'CASE-2026-0098',
      title: `Prior ${chart?.title || 'comparable collision'} settlement`,
      similarity: 0.88,
      baseRatio: base,
      settledRatio: base,
      disposition: 'Mutual settlement',
      resolvedDate: '2026-10-05',
      appliedModifiers: 'None (0%)',
      summary: `Resolved under comparable ${scenarioLabel(chart)} geometry and verified 4-camera timeline alignment.`,
    },
    {
      caseId: 'CASE-2025-0835',
      title: `${chart?.category || 'Comparative fault'} panel archive`,
      similarity: 0.81,
      baseRatio: base,
      settledRatio: base,
      disposition: 'KNIA dispute committee',
      resolvedDate: '2025-11-12',
      appliedModifiers: 'Baseline confirmed',
      summary: 'Committee preserved standard baseline where no disqualifying speed or signal violation existed.',
    },
  ];
};

const scenarioLabel = (codeOrObj) => {
  const obj = typeof codeOrObj === 'string'
    ? KNIA_CHART_CATALOG.find((x) => x.code === codeOrObj)
    : codeOrObj;
  if (obj?.short) return obj.short;
  return String(obj?.code || codeOrObj || '').replace(/^KNIA-/, 'Scenario ');
};

const formatKniaScenarioPill = (c) => {
  const ch = c?.selectedChart
    ? KNIA_CHART_CATALOG.find((x) => x.code === c.selectedChart)
    : null;
  if (!ch) return 'Pending';
  return scenarioLabel(ch);
};

const formatKniaScenarioTooltip = (c) => {
  const ch = c?.selectedChart
    ? KNIA_CHART_CATALOG.find((x) => x.code === c.selectedChart)
    : null;
  if (!ch) return 'Pending scenario';
  return `${scenarioLabel(ch)} · ${ch.title}`;
};

const renderScenarioPillTooltipHtml = (c, placement = 'top-start') => {
  const kniaPill = formatKniaScenarioPill(c);
  const kniaTooltip = formatKniaScenarioTooltip(c);
  return `<span class="ds-tooltip ds-tooltip--${placement} ux-case-knia-tooltip"><span class="ds-badge ds-badge--pill ds-badge--default ux-case-knia-pill" tabindex="0"><span class="ux-case-knia-pill__text">${esc(kniaPill)}</span></span><span class="ds-tooltip__content" role="tooltip">${esc(kniaTooltip)}</span></span>`;
};

const buildInitialCases = () => {
  const seedMeta = {
    'CASE-2026-0148': {
      policyNo: 'POL-2026-8801',
      customerName: 'Minh Quan Nguyen',
      accidentTime: '2026-11-16 08:42',
      location: 'Gangnam-daero 310 Junction, Seoul',
      summary: 'Broadside impact clearing green junction',
      stage: 'pending_chart',
      analysisDone: false,
      selectedChart: 'KNIA-205',
      interpretation: '',
      versions: [],
      factors: [
        { id: 'f1', side: 'counterparty', group: 'Scenario', title: 'Entered on solid green (+1.8s)', rationale: 'Cam 1 overhead signal verified.', delta: 10, status: 'negotiating', note: '' },
        { id: 'f2', side: 'counterparty', group: 'Conduct', title: 'Counterparty speed +14 km/h', rationale: 'Optical flow 54 km/h in 40 zone.', delta: 10, status: 'negotiating', note: 'Counterparty acknowledged speed' },
        { id: 'f3', side: 'insured', group: 'Conduct', title: 'Late evasive steering claim', rationale: 'Counterparty alleges 0.2s lag.', delta: 10, status: 'negotiating', note: 'Disproved at 00:11.6 frame' },
        { id: 'f3b', side: 'insured', group: 'Situational', title: 'Obstructed right-corner sightline', rationale: 'Corner pillar limits cross-lane view at 00:11.2.', delta: 5, status: 'negotiating', note: '' },
      ],
    },
    'CASE-2026-0147': {
      policyNo: 'POL-2026-7742',
      customerName: 'Thu Ha Tran',
      accidentTime: '2026-11-16 14:15',
      location: 'Olympic-daero Banpo Merge',
      summary: 'Sudden lateral cut-in collision',
      stage: 'negotiating',
      analysisDone: true,
      selectedChart: 'KNIA-252',
      interpretation: 'Counterparty merged without signal 0.9s before impact; 70:30 baseline confirmed.',
      versions: [
        { ver: 'v1', chartCode: 'KNIA-252', baseRatio: '30 : 70', interpretation: 'Counterparty merged without signal 0.9s before impact; 70:30 baseline confirmed.', createdAt: 'Today 08:50:12', eventsCount: 4 },
      ],
      factors: [
        { id: 'f4', side: 'counterparty', group: 'Scenario', title: 'No turn blinker prior to merge', rationale: 'Cam 1 inactive blinker frames.', delta: 10, status: 'negotiating', note: 'Agreed by counterparty rep' },
        { id: 'f5', side: 'insured', group: 'Conduct', title: 'Blind-spot gap claim', rationale: 'Opponent alleges acceleration.', delta: 10, status: 'negotiating', note: 'Reviewing telemetry' },
        { id: 'f5b', side: 'insured', group: 'Situational', title: 'Narrow merge taper geometry', rationale: 'Short acceleration pocket near Banpo entry.', delta: 5, status: 'negotiating', note: '' },
      ],
    },
    'CASE-2026-0146': {
      policyNo: 'POL-2026-9105',
      customerName: 'Ji-hoon Park',
      accidentTime: '2026-11-15 19:22',
      location: 'Yeongdong-daero Tunnel Exit',
      summary: 'Tunnel glare paused impact tracking',
      stage: 'undetermined',
      analysisDone: false,
      haltStage: 'Unclear lane marking',
      haltReason: 'Low-light glare on Cam 2 obscured contact at 00:12.4.',
      selectedChart: null,
      interpretation: '',
      versions: [],
      factors: [],
    },
    'CASE-2026-0145': {
      policyNo: 'POL-2026-6620',
      customerName: 'Hoang Nam Le',
      accidentTime: '2026-11-15 17:04',
      location: 'Teheran-ro Crosswalk 14',
      summary: 'Permissive green left-turn contact',
      stage: 'agreed',
      analysisDone: true,
      selectedChart: 'KNIA-221',
      interpretation: 'Both insurers confirmed Scenario 221 baseline 60:40.',
      versions: [
        { ver: 'v1', chartCode: 'KNIA-221', baseRatio: '40 : 60', interpretation: 'Both insurers confirmed Scenario 221 baseline 60:40.', createdAt: 'Yesterday 16:30:05', eventsCount: 4 },
      ],
      factors: [
        { id: 'f6', side: 'counterparty', group: 'Scenario', title: 'Delayed oncoming turn entry', rationale: 'Entered near amber phase.', delta: 0, status: 'agreed', note: 'Settled at 60:40' },
      ],
    },
    'CASE-2026-0144': {
      policyNo: 'POL-2026-8801',
      customerName: 'Soo-yeon Kim',
      accidentTime: '2026-11-15 22:18',
      location: 'Mapo Bridge North',
      summary: 'Nighttime red-light junction hit',
      stage: 'analyzing',
      analysisDone: false,
      selectedChart: 'KNIA-203',
      interpretation: '',
      versions: [],
      factors: [],
    },
    'CASE-2026-0143': {
      policyNo: 'POL-2026-7742',
      customerName: 'Gia Bao Pham',
      accidentTime: '2026-11-14 11:08',
      location: 'Songdo Central Roundabout',
      summary: 'Two-lane rotary merge squeeze',
      stage: 'pending_report',
      analysisDone: true,
      selectedChart: 'KNIA-263',
      interpretation: 'Both vehicles overlapped lane divider at yield line.',
      versions: [],
      factors: [],
    },
    'CASE-2026-0142': {
      policyNo: 'POL-2026-9105',
      customerName: 'Ngoc Anh Vu',
      accidentTime: '2026-11-14 09:35',
      location: 'Jamsil U-turn Pocket B',
      summary: 'Wide U-turn sweep encroaching lane 2',
      stage: 'negotiating',
      analysisDone: true,
      selectedChart: 'KNIA-246',
      interpretation: 'Upgraded to Scenario 246 in v2 via CCTV proof.',
      versions: [
        { ver: 'v1', chartCode: 'KNIA-252', baseRatio: '30 : 70', interpretation: 'Initial hypothesis before CCTV upload.', createdAt: '2 days ago 10:12:00', eventsCount: 3 },
        { ver: 'v2', chartCode: 'KNIA-246', baseRatio: '20 : 80', interpretation: 'Upgraded to Scenario 246 in v2 via CCTV proof.', createdAt: '2 days ago 14:40:19', eventsCount: 4 },
      ],
      factors: [
        { id: 'f7', side: 'counterparty', group: 'Scenario', title: '2-lane U-turn encroachment', rationale: 'CAM 04 CCTV tracks rear swing radius.', delta: 0, status: 'negotiating', note: 'Counterparty reviewing v2' },
      ],
    },
    'CASE-2026-0141': {
      policyNo: 'POL-2026-6620',
      customerName: 'Quoc Huy Dang',
      accidentTime: '2026-11-12 15:48',
      location: 'COEX B2 Parking Aisle D4',
      summary: 'Reverse bay egress contact',
      stage: 'closed',
      analysisDone: true,
      isClosed: true,
      closeReason: 'Mutual settlement',
      closeMemo: 'Signed settlement agreement at 30:70 (Chart 504).',
      closedAt: '2026-11-13 17:10',
      selectedChart: 'KNIA-504',
      interpretation: 'Settled under Chart 504 off-street bay rule.',
      versions: [
        { ver: 'v1', chartCode: 'KNIA-504', baseRatio: '70 : 30', interpretation: 'Settled under Chart 504 off-street bay rule.', createdAt: '2026-11-12 18:05:00', eventsCount: 4 },
      ],
      factors: [
        { id: 'f8', side: 'insured', group: 'Scenario', title: 'Aisle speed above 15 km/h', rationale: 'Agreed prior to settlement.', delta: 0, status: 'agreed', note: 'Closed (Mutual settlement)' },
      ],
    },
  };

  const rows = Array.from(document.querySelectorAll('#accident-case-table tbody tr[data-case-row]'));
  return rows.map((row, rowIdx) => {
    const cells = row.querySelectorAll('td');
    const id = cells[0]?.querySelector('code')?.textContent?.trim() || 'CASE-2026-0000';
    const plate = cells[1]?.textContent?.trim() || '';
    const scenario = row.dataset.scenarioKey || cells[3]?.textContent?.trim() || 'Intersection T-bone';
    const ratio = cells[4]?.querySelector('.ds-ratio-cell__value')?.textContent?.trim() || '20 : 80';
    const thumb = `./assets/video-thumbs/cam-0${(rowIdx % 4) + 1}.jpg`;
    const meta = seedMeta[id] || {
      policyNo: 'POL-2026-8801',
      customerName: 'Customer',
      accidentTime: '2026-11-16 09:00',
      location: 'Seoul Urban Junction',
      summary: scenario,
      stage: 'pending_chart',
      analysisDone: false,
      selectedChart: 'KNIA-205',
      interpretation: '',
      versions: [],
      factors: [],
    };
    const [ourPct, oppPct] = ratio.split(':').map((n) => parseInt(n.trim(), 10) || 0);
    return {
      id,
      plate,
      scenario,
      thumb,
      baseRatio: ratio,
      baseInsuredPct: ourPct,
      baseOpponentPct: oppPct,
      archived: row.dataset.archived === 'true',
      videos: [
        { slot: 1, label: 'Front dashcam', name: 'front_dashcam_1080p.mp4', durationSec: 24, impactLocalSec: 12.4, masterStartSec: 2.6, masterEndSec: 26.6, sizeMb: 42, present: true },
        { slot: 2, label: 'Rear camera', name: 'rear_cam_1080p.mp4', durationSec: 18, impactLocalSec: 8.4, masterStartSec: 6.6, masterEndSec: 24.6, sizeMb: 31, present: true },
        { slot: 3, label: 'Counterparty cam', name: 'opponent_cam_1080p.mp4', durationSec: 13.5, impactLocalSec: 4.5, masterStartSec: 10.5, masterEndSec: 24.0, sizeMb: 22, present: true },
        { slot: 4, label: 'Intersection CCTV', name: 'junction_cctv_720p.mp4', durationSec: 30, impactLocalSec: 15.0, masterStartSec: 0.0, masterEndSec: 30.0, sizeMb: 48, present: true },
      ],
      events: [
        { id: 'ev1', shortTag: 'Entry', kind: 'entry', hud: 'Approach · 42 km/h', name: 'Corridor entry', time: '00:09.8', conf: 95, source: 'CV Track', frame: 'Frame 588', cam: 1 },
        { id: 'ev2', shortTag: 'Signal', kind: 'signal', hud: 'Green · Verified', name: 'Green phase check', time: '00:11.6', conf: 92, source: 'Telemetry', frame: 'Frame 696', cam: 4 },
        { id: 'ev3', shortTag: 'Impact', kind: 'impact', hud: 'Impact · 2.8G peak', name: 'Primary impact', time: '00:12.4', conf: 98, source: 'IMU + CV', frame: 'Frame 744', cam: 1 },
        { id: 'ev4', shortTag: 'Stop', kind: 'rest', hud: 'Rest · 0 km/h', name: 'Final resting stop', time: '00:14.8', conf: 94, source: 'IMU', frame: 'Frame 888', cam: 2 },
      ],
      lowMatchSimulation: false,
      manualCharts: [],
      pdfSections: [
        { id: 'sec1', title: '1. Case metadata', enabled: true, body: `${id} | Plate ${plate} | ${meta.location}` },
        { id: 'sec2', title: '2. Video keyframes', enabled: true, body: 'Synced 4 feeds on 0:30.00 timeline (impact 0:15.00).' },
        { id: 'sec3', title: '3. Accident scenario', enabled: true, body: `${scenarioLabel(meta.selectedChart || 'KNIA-205')} confirmed.` },
        { id: 'sec4', title: '4. Final split', enabled: true, body: 'Agreed modifiers signed off.' },
      ],
      noticeChannel: 'kakao',
      noticeMessage: `${id} (${plate})\n${scenarioLabel(meta.selectedChart || 'KNIA-205')} · ${ratio}\nVerified clips attached.`,
      publicNoticeLink: '',
      noticePrecedentState: {},
      selectedEvidenceMap: {},
      evidenceAnalysedChart: meta.versions?.length ? meta.selectedChart : null,
      step3AnalysedKey: (meta.stage === 'agreed' || meta.stage === 'closed') ? getChartDefaultEvSig(meta.selectedChart) : null,
      ...meta,
      factors: (meta.factors || []).map((f) => ({
        ...f,
        note: f.note || f.rationale || 'Verified from synchronized multi-cam telemetry.',
      })),
    };
  });
};

export function initSmtWorkflows(bridge) {
  const store = {
    cases: buildInitialCases(),
    activeCaseId: 'CASE-2026-0148',
    activeStep: 1,
    activeNav: 'home',
    step2SubTab: 'supporting',
    step2RemovedOpen: false,
    expandedScenarioByCase: {},
    expandedRefByCase: {},
    expandedModByCase: {},
    activeConditionTarget: null,
    activeTimelineRange: null,
    activeStep2EvidenceTag: null,
    step1ReanalyseDraft: null,
    furthestStepByCase: {},
    openNoteFactorIds: new Set(),
    openPdfSectionId: null,
    activityLog: [
      { id: 'log-1', caseId: 'CASE-2026-0148', type: 'ANALYSIS', actor: 'AI VLM', action: 'Queued 4-camera video review', time: 'Today 09:12:04' },
      { id: 'log-2', caseId: 'CASE-2026-0147', type: 'REPORT', actor: 'Adjuster', action: 'Confirmed Report v1 (Scenario 252 · 70:30)', time: 'Today 08:50:12' },
      { id: 'log-3', caseId: 'CASE-2026-0146', type: 'ANALYSIS', actor: 'AI VLM', action: 'Paused at Unclear lane marking due to glare', time: 'Today 08:25:44' },
      { id: 'log-4', caseId: 'CASE-2026-0145', type: 'NEGO', actor: 'Adjuster', action: 'Settled negotiation at 60:40 (Mutual settlement)', time: 'Yesterday 16:45:10' },
      { id: 'log-5', caseId: 'CASE-2026-0141', type: 'OTHER', actor: 'Adjuster', action: 'Closed case (Mutual settlement) · Read-only enabled', time: '2026-11-13 17:10' },
    ],
  };

  window.SMT_STORE = store;

  const logActivity = (caseId, type, action, actor = 'Adjuster') => {
    store.activityLog.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      caseId,
      type,
      actor,
      action,
      time: nowStamp(),
    });
  };

  const ICON_ALERT_TRIANGLE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 21L12 3L2 21H22Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 15L12 10M12 16.5L12 18" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  const ICON_ALERT_CIRCLE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 14L12 7M12 15.5L12 17" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  const ICON_INFO_CIRCLE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 10H12.75V9.25H12V10ZM11.25 10V17H12.75V10H11.25ZM10 10.75H12V9.25H10V10.75ZM11.25 6.5V8H12.75V6.5H11.25Z" fill="currentColor"/></svg>';
  const ICON_PLUS = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10.75 13.25V20H13.25V13.25H20V10.75H13.25V4H10.75V10.75H4V13.25H10.75Z" fill="currentColor"/></svg>';
  const ICON_CLOCK_SM = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM13 11.5858V7H11V12.4142L13.7929 15.2071L15.2071 13.7929L13 11.5858Z" fill="currentColor"/></svg>';
  const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 14L8.5 17.5L19 6.5" stroke="currentColor" stroke-width="1.5"/></svg>';
  const ICON_ARROW_RIGHT = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6L15 12L9 18" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="16"/></svg>';
  const ICON_EXPORT_DOC = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 22L21 19L18 16M21 19L13 19" stroke="currentColor" stroke-width="1.5"/><path d="M3 22H2.25C2.25 22.4142 2.58579 22.75 3 22.75V22ZM20 2H20.75C20.75 1.58579 20.4142 1.25 20 1.25V2ZM10 2V1.25H9.68934L9.46967 1.46967L10 2ZM3 9L2.46967 8.46967L2.25 8.68934V9H3ZM10 9V9.75H10.75V9H10ZM11 21.25H3V22.75H11V21.25ZM20 1.25H10V2.75H20V1.25ZM2.25 9V22H3.75V9H2.25ZM9.46967 1.46967L2.46967 8.46967L3.53033 9.53033L10.5303 2.53033L9.46967 1.46967ZM9.25 2V9H10.75V2H9.25ZM10 8.25H3V9.75H10V8.25ZM19.25 2V13H20.75V2H19.25Z" fill="currentColor"/></svg>';
  const ICON_KB_PENDING = '<svg class="ux-kb-colhead__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM13 11.5858V7H11V12.4142L13.7929 15.2071L15.2071 13.7929L13 11.5858Z" fill="currentColor"/></svg>';
  const ICON_KB_AGREED = '<svg class="ux-kb-colhead__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 22.75C6.06294 22.75 1.25 17.9371 1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75ZM15.2473 7.93933L10.453 13.1694L8.69156 11.4079L7.27734 12.8222L10.5159 16.0607L16.7216 9.29078L15.2473 7.93933Z" fill="currentColor"/></svg>';
  const ICON_KB_EXCLUDED = '<svg class="ux-kb-colhead__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 22.75C6.06294 22.75 1.25 17.9371 1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75ZM15.293 7.29285L11.9998 10.5858L8.70714 7.29337L7.29297 8.70763L10.5855 12L7.29297 15.2923L8.70714 16.7066L11.9998 13.4141L15.293 16.7071L16.7071 15.2928L13.414 12L16.7071 8.70711L15.293 7.29285Z" fill="currentColor"/></svg>';
  const ICON_FILE_VIDEO = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18.75 15.75H11.75V22.75H18.75V15.75Z" fill="currentColor"/><path d="M21.75 16.75V21.75L19.8606 20.7428V17.7657L21.75 16.75Z" fill="currentColor"/><path d="M20.75 2.22727C20.75 1.68754 20.3141 1.25 19.7763 1.25H9.63616L2.25 8.66338V21.7727C2.25 22.3125 2.68593 22.75 3.22368 22.75H9.01306V20.7955H4.19727V10.0455H11.0131L11.0131 3.20459H18.8025V13H20.75V2.22727Z" fill="currentColor"/></svg>';
  const ICON_CLOSE_SM = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 10.2623L18.0123 4.25L19.75 5.98775L13.7377 12L19.75 18.0123L18.0123 19.75L12 13.7377L5.98775 19.75L4.25 18.0123L10.2623 12L4.25 5.98775L5.98775 4.25L12 10.2623Z" fill="currentColor"/></svg>';
  const ICON_DETAILS = '<svg class="ux-mcard__note-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.75 21.7727C2.75 22.3125 3.18593 22.75 3.72368 22.75H13.8638L21.25 15.3366V2.22727C21.25 1.68754 20.8141 1.25 20.2763 1.25H2.75V21.7727ZM12.4869 20.7954H4.69747V3.2045H19.3027V13.9545H12.4869L12.4869 20.7954Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16 8H8V6H16V8ZM12 12H8V10H12V12Z" fill="currentColor"/></svg>';
  const ICON_EDIT_SM = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M22 22L13 22L13 20L22 20L22 22Z" fill="currentColor"/><path d="M18.5298 11.4693L21.9991 8L15.9991 2L12.5302 5.46912L18.5298 11.4693Z" fill="currentColor"/><path d="M17.4691 12.53L11.4696 6.52981L2 16V22H7.99908L17.4691 12.53Z" fill="currentColor"/></svg>';
  const ICON_TRASH_SM = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.58085 1.85608C8.73843 1.4884 9.09997 1.25 9.5 1.25H14.5C14.9 1.25 15.2616 1.4884 15.4191 1.85608L16.6594 4.75H22V6.75H2V4.75H7.3406L8.58085 1.85608ZM9.51654 4.75H14.4835L13.8406 3.25H10.1594L9.51654 4.75Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M19.2492 22.0449L20.2492 5.54492H3.75195L4.75195 22.0449C4.77595 22.4408 5.10399 22.7495 5.50058 22.7495H18.5006C18.8972 22.7495 19.2252 22.4408 19.2492 22.0449ZM10.501 16.9995V10.9995H8.50098L8.50098 16.9995H10.501ZM15.501 16.9995V10.9995H13.501V16.9995H15.501Z" fill="currentColor"/></svg>';

  const renderVideoSlotMetaHtml = ({ hasFile, error, name, durationSec, sizeMb }) => {
    if (error) return `<span class="ux-video-slot__meta ux-video-slot__meta--error">${esc(error)}</span>`;
    if (!hasFile) return '<span class="ux-video-slot__meta ux-video-slot__meta--empty">Drop clip or upload</span>';
    return `
      <div class="ux-video-slot__file">
        <span class="ux-video-slot__file-icon" aria-hidden="true">${ICON_FILE_VIDEO}</span>
        <span class="ux-video-slot__file-name">${esc(name)}</span>
        <span class="ux-video-slot__file-size ux-num">${durationSec}s · ${sizeMb}MB</span>
      </div>
    `;
  };

  let activeUxToastTimer = null;
  let lastScenarioToastKey = '';
  const hideUxToast = () => {
    if (activeUxToastTimer) {
      clearTimeout(activeUxToastTimer);
      activeUxToastTimer = null;
    }
    document.querySelector('[data-ux-active-toast]')?.remove();
  };

  const showUxToast = (htmlContent, durationMs = 4200) => {
    hideUxToast();
    const toast = document.createElement('div');
    toast.className = 'ds-toast ds-toast--default ux-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.dataset.uxActiveToast = 'true';
    toast.innerHTML = `
      <span class="ds-toast__icon" aria-hidden="true">${ICON_INFO_CIRCLE}</span>
      <span class="ds-toast__content">${htmlContent}</span>
      <button type="button" class="ds-toast__close" aria-label="Dismiss notification">${ICON_CLOSE_SM}</button>
    `;
    toast.querySelector('.ds-toast__close')?.addEventListener('click', hideUxToast);
    document.body.appendChild(toast);
    if (durationMs > 0) {
      activeUxToastTimer = setTimeout(hideUxToast, durationMs);
    }
  };

  const mountFreshRoot = (containerEl) => {
    if (containerEl?.firstElementChild) bridge.mountDs?.(containerEl.firstElementChild);
  };

  const getCaseSet = (map, caseId, initValue = null) => {
    if (!caseId) return new Set();
    let set = map[caseId];
    if (!(set instanceof Set)) {
      set = new Set();
      if (initValue) set.add(initValue);
      map[caseId] = set;
    }
    return set;
  };

  const isReducedMotionPreferred = () => (
    document.documentElement.dataset.reducedMotion === 'true'
    || Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  );

  const bindZeroJumpTabStage = ({ tabsEl, stageEl, scrollEl }) => {
    if (!tabsEl || !stageEl || !scrollEl || tabsEl.dataset.uxZeroJumpBound === 'true') return;
    tabsEl.dataset.uxZeroJumpBound = 'true';
    let lockedScrollTop = null;

    const computeMinStageHeight = (targetScrollTop) => {
      if (targetScrollTop <= 0) return 0;
      const scrollRect = scrollEl.getBoundingClientRect();
      const stageRect = stageEl.getBoundingClientRect();
      const stageTopInContent = targetScrollTop + (stageRect.top - scrollRect.top);
      const stageBottomInContent = targetScrollTop + (stageRect.bottom - scrollRect.top);
      const tailBelowStage = Math.max(0, scrollEl.scrollHeight - stageBottomInContent);
      return Math.max(0, Math.ceil((targetScrollTop + scrollEl.clientHeight) - stageTopInContent - tailBelowStage));
    };

    const lockForCurrentScroll = () => {
      const curTop = scrollEl.scrollTop;
      if (curTop <= 0) {
        lockedScrollTop = null;
        stageEl.style.removeProperty('--ux-stage-min-h');
        return;
      }
      lockedScrollTop = curTop;
      const minH = computeMinStageHeight(curTop);
      if (minH > 0) stageEl.style.setProperty('--ux-stage-min-h', `${minH}px`);
      else stageEl.style.removeProperty('--ux-stage-min-h');
    };

    tabsEl.addEventListener('click', (e) => {
      if (e.target.closest('[role="tab"]')) lockForCurrentScroll();
    }, { capture: true });

    tabsEl.addEventListener('keydown', (e) => {
      if (!e.target.closest('[role="tab"]')) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') {
        lockForCurrentScroll();
      }
    }, { capture: true });

    const restoreLockedScroll = () => {
      if (lockedScrollTop === null) return;
      const target = lockedScrollTop;
      if (Math.abs(scrollEl.scrollTop - target) > 0.5) scrollEl.scrollTop = target;
      requestAnimationFrame(() => {
        if (!stageEl.isConnected || lockedScrollTop !== target) return;
        if (Math.abs(scrollEl.scrollTop - target) > 0.5) scrollEl.scrollTop = target;
      });
    };

    tabsEl.addEventListener('ds-tab-change', restoreLockedScroll);
    tabsEl.addEventListener('ds-change', restoreLockedScroll);

    const onScroll = () => {
      if (!stageEl.isConnected) {
        scrollEl.removeEventListener('scroll', onScroll);
        return;
      }
      if (lockedScrollTop === null) return;
      const curTop = scrollEl.scrollTop;
      if (curTop <= 0) {
        lockedScrollTop = null;
        stageEl.style.removeProperty('--ux-stage-min-h');
        return;
      }
      if (curTop < lockedScrollTop) {
        lockedScrollTop = curTop;
        const nextMin = computeMinStageHeight(curTop);
        if (nextMin > 0) stageEl.style.setProperty('--ux-stage-min-h', `${nextMin}px`);
        else stageEl.style.removeProperty('--ux-stage-min-h');
      }
    };

    scrollEl.addEventListener('scroll', onScroll, { passive: true });
  };

  const getCase = (caseId = store.activeCaseId) =>
    store.cases.find((c) => c.id === caseId) || store.cases[0];

  const getChartsForCase = (c) => {
    const manualSet = new Set(c.manualCharts || []);
    const ctxList = Array.isArray(c?.step1Contexts) ? c.step1Contexts.filter((item) => item?.text) : [];
    const ctxBoost = ctxList.reduce((sum, item) => sum + (item.mode === 'none' ? 2 : 4), 0);
    const legacyBoost = Number(c?.guidanceBoostByStep?.[1]) || 0;
    const baseBoost = Math.min(7, Math.max(0, ctxBoost || legacyBoost));
    const ctxBlob = ctxList.map((item) => item.text.toLowerCase()).join(' ');
    const aiMatches = c.lowMatchSimulation
      ? []
      : KNIA_CHART_CATALOG
          .map((ch) => {
            const rawFit = ch.fitByScenario?.[c.scenario] ?? (ch.code === c.selectedChart ? 78 : 14);
            let kwBonus = 0;
            if (ctxBlob) {
              const haystack = `${ch.title || ''} ${(ch.criteria || []).join(' ')} ${ch.kniaProse || ''}`.toLowerCase();
              const hits = ['red', 'green', 'left', 'right', 'cut-in', 'u-turn', 'rotary', 'reverse', 'speed', 'lane', 'rear', 'brake', 'signal']
                .filter((kw) => ctxBlob.includes(kw) && haystack.includes(kw)).length;
              kwBonus = Math.min(4, hits * 2);
            }
            const fit = rawFit >= 20 ? Math.min(99, rawFit + baseBoost + kwBonus) : rawFit;
            return { ...ch, fit, manual: Boolean(ch.isManual) };
          })
          .filter((ch) => ch.fit >= 20 && !ch.isManual)
          .sort((a, b) => b.fit - a.fit)
          .slice(0, 5);

    const aiCodes = new Set(aiMatches.map((x) => x.code));
    const manualExtras = [...manualSet]
      .filter((code) => !aiCodes.has(code))
      .map((code) => KNIA_CHART_CATALOG.find((x) => x.code === code))
      .filter(Boolean)
      .map((ch) => ({ ...ch, fit: ch.fitByScenario?.[c.scenario] ?? 100, manual: true }));

    return [...manualExtras, ...aiMatches];
  };

  const getTopConfidenceChartCode = (c, candidates = getChartsForCase(c)) => {
    if (!candidates.length) return c?.selectedChart || null;
    const pool = candidates.filter((ch) => !ch.manual);
    const list = pool.length ? pool : candidates;
    const topObj = list.reduce(
      (best, ch) => ((Number(ch.fit) || 0) > (Number(best.fit) || 0) ? ch : best),
      list[0]
    );
    return topObj?.code || c?.selectedChart || null;
  };

  const fitTier = (fit) => {
    if (fit >= 70) return { label: `${fit}%`, cls: 'ds-badge--green', meterCls: '' };
    if (fit >= 40) return { label: `${fit}%`, cls: 'ds-badge--yellow', meterCls: 'ux-fit-meter--med' };
    return { label: `${fit}%`, cls: 'ds-badge--red', meterCls: 'ux-fit-meter--low' };
  };

  const parseRatioInsuredPct = (ratioStr, fallback = 20) => {
    const m = String(ratioStr || '').match(/(\d{1,3})\s*:/);
    if (!m) return fallback;
    const n = parseInt(m[1], 10);
    return Number.isNaN(n) ? fallback : Math.max(0, Math.min(100, n));
  };

  const renderRingMeterHtml = (pct, { tone = 'success', size = 'sm' } = {}) => {
    const clamped = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
    return `
      <span class="ux-ring-meter ux-ring-meter--${esc(size)}" data-tone="${esc(tone)}"${clamped <= 0 ? ' data-empty="true"' : ''} aria-hidden="true">
        <svg class="ux-ring-meter__svg" viewBox="0 0 20 20" width="18" height="18" fill="none">
          <circle class="ux-ring-meter__track" cx="10" cy="10" r="7.5" />
          <circle class="ux-ring-meter__arc" cx="10" cy="10" r="7.5" pathLength="100" stroke-dasharray="${clamped} 100" transform="rotate(-90 10 10)" />
        </svg>
      </span>
    `;
  };

  const clampRatioUnit = (pct) => Math.max(0, Math.min(100, Number(pct) || 0)) / 100;

  const renderSplitBarHtml = ({
    cls = 'ux-as-split-track',
    attrs = '',
    baseTick = false,
    baseShifted = false,
    role = '',
    ariaLabel = '',
    valuenow = null,
  } = {}) => {
    const ariaAttrs = role
      ? ` role="${role}" aria-label="${esc(ariaLabel)}" aria-valuenow="${esc(valuenow)}" aria-valuemin="0" aria-valuemax="100"`
      : ' aria-hidden="true"';
    return `
      <div class="ux-ratio-bar ${cls}"${ariaAttrs}${attrs ? ` ${attrs}` : ''}>
        <span class="ux-ratio-bar__clip" aria-hidden="true">
          <span class="ux-ratio-bar__seg ux-ratio-bar__seg--a"></span>
          <span class="ux-ratio-bar__seg ux-ratio-bar__seg--b"></span>
        </span>
        ${baseTick ? `<span class="ux-split-bar__base" data-ux-tug-base data-shifted="${baseShifted}" aria-hidden="true"></span>` : ''}
      </div>
    `;
  };

  const renderMiniSplitSvg = (ourPct) => {
    const aPct = Math.max(0, Math.min(100, Number(ourPct) || 0));
    const bPct = 100 - aPct;
    const gap = aPct > 0 && bPct > 0 ? 3 : 0;
    const minSeg = 8;
    let splitX = aPct;
    if (aPct > 0 && bPct > 0) {
      splitX = Math.max(minSeg + gap / 2, Math.min(100 - minSeg - gap / 2, splitX));
    }
    const aW = aPct > 0 ? +Math.max(0, splitX - gap / 2).toFixed(2) : 0;
    const bX = +Math.min(100, splitX + gap / 2).toFixed(2);
    const bW = bPct > 0 ? +Math.max(0, 100 - bX).toFixed(2) : 0;
    return `
      <svg class="ux-mini-split" viewBox="0 0 100 10" width="50" height="8" fill="none" aria-hidden="true">
        ${aW > 0 ? `<rect class="ux-mini-split__a" x="0" y="1" width="${aW}" height="8" rx="4" />` : ''}
        ${bW > 0 ? `<rect class="ux-mini-split__b" x="${bX}" y="1" width="${bW}" height="8" rx="4" />` : ''}
      </svg>
    `;
  };

  const isCounterpartyMod = (f) => f?.side === 'counterparty' || f?.side === 'our';
  const formatAddPct = (delta) => `+${Math.abs(Number(delta) || 0)}%`;
  const modifierPartyLabel = (f, withCode = false) => (
    isCounterpartyMod(f)
      ? (withCode ? 'Counterparty (B)' : 'Counterparty')
      : (withCode ? 'Insured (A)' : 'Insured')
  );

  const renderDeltaBarSvg = (delta, isOppAdd) => {
    const oppAdd = typeof isOppAdd === 'boolean' ? isOppAdd : isOppAdd === 'counterparty' || isOppAdd === 'our';
    const weight = Math.abs(Number(delta) || 0);
    const len = weight > 0 ? Math.max(8, Math.round((Math.min(40, weight) / 40) * 56)) : 0;
    return `
      <svg class="ux-delta-bar" viewBox="0 0 60 8" width="52" height="8" fill="none" aria-hidden="true">
        <rect class="ux-delta-bar__track" x="2" y="2" width="56" height="4" rx="2" />
        ${len > 0 ? `<rect class="${oppAdd ? 'ux-delta-bar__fill--counterparty' : 'ux-delta-bar__fill--insured'}" x="2" y="2" width="${len}" height="4" rx="2" />` : ''}
      </svg>
    `;
  };

  const isSituationalFactor = (f) => f?.group === 'Situational' || f?.group === 'Scenario';

  const computeNegotiatedRatio = (c) => {
    const baseOpp = c.baseOpponentPct;
    const baseOur = c.baseInsuredPct;
    const active = (c.factors || []).filter((f) => !f.archivedUnder);
    const sumAbsDelta = (items) => items.reduce((acc, f) => acc + Math.abs(Number(f.delta) || 0), 0);

    const agreedItems = active.filter((f) => f.status === 'agreed');
    const pendingItems = active.filter((f) => f.status === 'negotiating');
    const excludedItems = active.filter((f) => f.status === 'excluded');

    const agreedOppAdd = sumAbsDelta(agreedItems.filter(isCounterpartyMod));
    const agreedOurAdd = sumAbsDelta(agreedItems.filter((f) => !isCounterpartyMod(f)));
    const pendingOppAdd = sumAbsDelta(pendingItems.filter(isCounterpartyMod));
    const pendingOurAdd = sumAbsDelta(pendingItems.filter((f) => !isCounterpartyMod(f)));

    const netOppShift = agreedOppAdd - agreedOurAdd;
    const finalOpp = Math.max(0, Math.min(100, baseOpp + netOppShift));
    const finalOur = 100 - finalOpp;
    const maxOpp = Math.max(0, Math.min(100, finalOpp + pendingOppAdd));
    const minOpp = Math.max(0, Math.min(100, finalOpp - pendingOurAdd));
    const minOur = 100 - maxOpp;
    const maxOur = 100 - minOpp;

    return {
      baseOpp,
      baseOur,
      agreedOppAdd,
      agreedOurAdd,
      pendingOppAdd,
      pendingOurAdd,
      netOppShift,
      finalOpp,
      finalOur,
      minOpp,
      maxOpp,
      minOur,
      maxOur,
      agreedCount: agreedItems.length,
      pendingCount: pendingItems.length,
      excludedCount: excludedItems.length,
      text: `${finalOur} : ${finalOpp}`,
    };
  };

  // ── Canonical DS Modal Helper ──
  const dialogs = {
    createCase: document.getElementById('modal-create-case'),
    closedEntry: document.getElementById('modal-closed-entry'),
    manageVideos: document.getElementById('modal-manage-videos'),
    frameLightbox: document.getElementById('modal-frame-lightbox'),
    scenarioRef: document.getElementById('modal-scenario-reference'),
    chartCompare: document.getElementById('modal-chart-compare'),
    kniaLibrary: document.getElementById('modal-knia-library'),
    addModifier: document.getElementById('modal-add-modifier'),
    versionWarning: document.getElementById('modal-version-warning'),
    closeCase: document.getElementById('modal-close-case'),
    caseHistory: document.getElementById('modal-case-history'),
    pdfPreview: document.getElementById('modal-pdf-preview'),
  };

  const isDialogOpen = (dlg) => Boolean(dlg && !dlg.hidden);
  const dialogOpeners = new WeakMap();
  const dialogWasOpen = new WeakSet();

  const restoreDialogOpenerFocus = (dlg) => {
    if (!dlg || !dialogWasOpen.has(dlg)) return;
    dialogWasOpen.delete(dlg);
    const opener = dialogOpeners.get(dlg);
    dialogOpeners.delete(dlg);
    if (opener && opener.isConnected && typeof opener.focus === 'function') {
      requestAnimationFrame(() => {
        if (dlg.hidden && opener.isConnected) opener.focus({ preventScroll: true });
      });
    }
  };

  const openDialogSmooth = (dlg) => {
    if (!dlg) return;
    if (!dialogWasOpen.has(dlg)) {
      const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (opener && !dlg.contains(opener)) dialogOpeners.set(dlg, opener);
      dialogWasOpen.add(dlg);
    }
    dlg.removeAttribute('data-closing');
    dlg.hidden = false;
    const autoFocusEl = dlg.querySelector('[autofocus], input:not([type="hidden"]):not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled)');
    if (autoFocusEl && typeof autoFocusEl.focus === 'function') {
      requestAnimationFrame(() => {
        if (!dlg.hidden) autoFocusEl.focus({ preventScroll: true });
      });
    }
  };

  const closeDialogSmooth = (dlg) => {
    if (!dlg) return;
    dlg.removeAttribute('data-closing');
    if (!dlg.hidden) dlg.hidden = true;
    restoreDialogOpenerFocus(dlg);
    if (dlg === dialogs.frameLightbox) activeLightboxState = null;
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const nonEscModal = Object.values(dialogs).find((dlg) => isDialogOpen(dlg) && dlg.dataset.closedby === 'none');
      if (nonEscModal) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
      return;
    }
    if (e.key !== 'Tab') return;
    const openDlgs = Object.values(dialogs).filter(isDialogOpen);
    const activeDlg = openDlgs[openDlgs.length - 1];
    if (!activeDlg) return;
    const focusables = Array.from(activeDlg.querySelectorAll(
      'a[href], button:not(:disabled), input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )).filter((el) => !el.closest('[hidden]') && !el.closest('[inert]') && el.getClientRects().length > 0);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first || !activeDlg.contains(document.activeElement)) {
        e.preventDefault();
        last.focus({ preventScroll: true });
      }
    } else if (document.activeElement === last || !activeDlg.contains(document.activeElement)) {
      e.preventDefault();
      first.focus({ preventScroll: true });
    }
  }, true);

  Object.values(dialogs).forEach((dlg) => {
    if (!dlg) return;
    if (typeof MutationObserver === 'function') {
      new MutationObserver(() => {
        if (dlg.hidden && dialogWasOpen.has(dlg)) {
          restoreDialogOpenerFocus(dlg);
          if (dlg === dialogs.frameLightbox) activeLightboxState = null;
          dlg.dispatchEvent(new CustomEvent('ux-dialog-closed'));
        }
      }).observe(dlg, { attributes: true, attributeFilter: ['hidden'] });
    }
    dlg.addEventListener('pointerdown', (e) => {
      if (e.target !== dlg) return;
      const mode = dlg.dataset.closedby;
      if (mode === 'none' || mode === 'closerequest') {
        e.stopPropagation();
      }
    }, true);
    dlg.querySelectorAll('[data-ux-dialog-close], [data-ds-dialog-close]').forEach((btn) => {
      btn.addEventListener('click', () => closeDialogSmooth(dlg));
    });
  });

  // ── Home Table Rows, Grid View, Sorting, Pagination & Stage Filter ──
  const tableBody = document.querySelector('#accident-case-table tbody');
  const caseGridEl = document.querySelector('[data-case-grid]');
  const filterTriggerList = document.querySelector('[data-case-state-filter] .ds-filter__list');
  const scenarioFilterList = document.querySelector('[data-case-scenario-filter] .ds-filter__list');
  const faultFilterList = document.querySelector('[data-case-fault-filter] .ds-filter__list');
  const breadcrumbSwitcherList = document.querySelector('[data-detail-switcher-list]');
  const homePaginationEl = document.querySelector('.ds-workspace-pagination [data-ds-pagination]');
  let homePage = 1;
  let homePageSize = 10;

  const getFaultBiasKey = (ourPct, oppPct) => (
    ourPct < oppPct ? 'counterparty' : (ourPct > oppPct ? 'insured' : 'equal')
  );

  const getCaseScenarioTitle = (c) => {
    const ch = c?.selectedChart ? KNIA_CHART_CATALOG.find((x) => x.code === c.selectedChart) : null;
    return ch?.title || c?.summary || '';
  };

  const renderCaseGridCardHtml = ({ c, thumbSrc, stageInfo, actionBtnHtml, cardAttr = 'data-case-card', includeFilters = true }) => `
    <article class="ux-case-grid-card" tabindex="0" ${cardAttr} data-case-id="${esc(c.id)}"${includeFilters ? ` data-stage="${esc(c.stage)}" data-state="${esc(stageInfo.step)}" data-chart-code="${esc(c.selectedChart || 'pending')}" data-fault-bias="${esc(getFaultBiasKey(c.baseInsuredPct, c.baseOpponentPct))}"` : ''}${c.archived ? ' data-archived="true"' : ''}>
      <div class="ux-case-grid-card__media">
        <img class="ux-case-grid-card__img" src="${esc(thumbSrc)}" alt="" decoding="async" />
        ${actionBtnHtml}
      </div>
      <div class="ux-case-grid-card__body">
        <div class="ux-case-grid-card__head">
          <code class="ux-case-grid-card__code">${esc(c.id)}</code>
          <span class="ds-badge ds-badge--pill ${stageInfo.badge}">${esc(stageInfo.label)}</span>
        </div>
        <p class="ux-case-grid-card__summary">${esc(c.summary || getCaseScenarioTitle(c))}</p>
        <div class="ux-case-grid-card__meta">
          <span class="ux-num">${esc(c.plate)}</span>
          <span aria-hidden="true">·</span>
          <span>${esc(formatKniaScenarioPill(c))}</span>
        </div>
        <div class="ux-case-grid-card__foot">
          <div class="ds-ratio-cell">
            ${renderSplitBarHtml({
              cls: 'ds-progress-bar ux-ratio-bar--sm ux-ratio-bar--neutral',
              role: 'progressbar',
              ariaLabel: `Base ratio ${c.baseRatio}`,
              valuenow: c.baseInsuredPct,
            })}
            <span class="ds-ratio-cell__value">${esc(c.baseRatio)}</span>
          </div>
        </div>
      </div>
    </article>
  `;

  const bindFilterMenuSearch = (menuEl) => {
    if (!menuEl || menuEl.dataset.uxFilterSearchBound) return;
    const searchInput = menuEl.querySelector('.ux-filter__search .ds-search-input__field');
    const clearBtn = menuEl.querySelector('.ux-filter__search .ds-search-input__clear');
    const emptyEl = menuEl.querySelector('[data-ux-filter-empty]');
    const root = menuEl.closest('[data-ds-filter]');
    if (!searchInput) return;
    menuEl.dataset.uxFilterSearchBound = 'true';

    const syncQuery = () => {
      const q = searchInput.value.trim().toLowerCase();
      if (clearBtn) clearBtn.hidden = searchInput.value.length === 0;
      let visibleCount = 0;
      menuEl.querySelectorAll('.ds-filter__item').forEach((item) => {
        const match = q.length === 0 || item.textContent.trim().toLowerCase().includes(q);
        item.hidden = !match;
        if (match) visibleCount += 1;
      });
      if (emptyEl) emptyEl.hidden = visibleCount > 0;
    };

    searchInput.addEventListener('input', syncQuery);
    clearBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchInput.value = '';
      syncQuery();
      searchInput.focus({ preventScroll: true });
    });
    root?.querySelector('.ds-filter__trigger')?.addEventListener('click', () => {
      if (root.dataset.dsOpen === 'true' && searchInput.value) {
        searchInput.value = '';
        syncQuery();
      }
    });
    root?.addEventListener('ds-change', () => {
      if (searchInput.value || emptyEl?.hidden === false) {
        searchInput.value = '';
        syncQuery();
      }
    });
  };

  const bindSingleSelectFilterList = (listEl, items, selectedVal = 'all') => {
    if (!listEl) return;
    listEl.innerHTML = items.map(([val, text]) => {
      const isMatch = val === selectedVal;
      return `
        <button type="button" class="ds-filter__item" role="option" data-value="${esc(val)}" aria-selected="${isMatch}"${isMatch ? ' data-checked="true"' : ''}>
          <span class="ds-filter__check${isMatch ? '' : ' ds-filter__check--empty'}" aria-hidden="true">${isMatch ? ICON_CHECK : ''}</span>
          <span>${esc(text)}</span>
        </button>
      `;
    }).join('');
    bindFilterMenuSearch(listEl.closest('.ds-filter__menu'));

    if (listEl.dataset.uxFilterBound) return;
    listEl.dataset.uxFilterBound = 'true';
    listEl.addEventListener('click', (e) => {
      const item = e.target.closest('.ds-filter__item');
      if (!item || item.disabled) return;
      e.stopPropagation();
      const root = listEl.closest('[data-ds-filter]');
      if (!root) return;
      const trigger = root.querySelector('.ds-filter__trigger, .ds-filter-pill');
      const menu = root.querySelector('.ds-filter__menu');
      const labelSpan = root.querySelector('[data-ds-filter-value]');
      const clearBtn = root.querySelector('.ds-filter__clear, .ds-filter-pill__close');
      const defaultLabel = root.dataset.label || root.dataset.placeholder || 'Filter';

      root.querySelectorAll('.ds-filter__item').forEach((option) => {
        const isMatch = option === item;
        option.dataset.checked = String(isMatch);
        option.setAttribute('aria-selected', String(isMatch));
        const checkEl = option.querySelector('.ds-filter__check');
        if (checkEl) {
          checkEl.classList.toggle('ds-filter__check--empty', !isMatch);
          checkEl.innerHTML = isMatch ? ICON_CHECK : '';
        }
      });

      const val = item.dataset.value || 'all';
      const itemText = item.querySelector('span:last-child')?.textContent?.trim() || defaultLabel;
      const isActive = val !== 'all';
      if (labelSpan) labelSpan.textContent = isActive ? itemText : defaultLabel;
      root.dataset.active = String(isActive);
      if (trigger) trigger.dataset.active = String(isActive);
      if (clearBtn) clearBtn.hidden = !isActive;
      const bar = root.closest('.ds-filter-bar');
      const anyActiveFilter = Array.from(bar?.querySelectorAll('[data-ds-filter]') || []).some((f) => f.dataset.active === 'true');
      const searchField = bar?.querySelector('[data-ds-search-input] .ds-search-input__field');
      const hasSearch = Boolean(searchField && searchField.value.trim().length > 0);
      bar?.querySelectorAll('[data-ds-filter-reset]').forEach((btn) => {
        btn.hidden = !(anyActiveFilter || hasSearch);
      });
      root.dataset.dsOpen = 'false';
      trigger?.setAttribute('aria-expanded', 'false');
      trigger?.blur();
      item.blur();
      if (menu) menu.hidden = true;
      root.dispatchEvent(new CustomEvent('ds-change', {
        bubbles: true,
        detail: { value: val, values: isActive ? [val] : [], active: isActive },
      }));
    });
  };

  const syncHomePagination = () => {
    bridge.filterCaseTable();
    if (!tableBody) return;
    const emptyRow = tableBody.querySelector('[data-case-empty]');
    if (emptyRow) tableBody.appendChild(emptyRow);

    const allRows = Array.from(tableBody.querySelectorAll('tr[data-case-row]'));
    const allCards = Array.from(caseGridEl?.querySelectorAll('[data-case-card]') || []);
    const matchingRows = allRows.filter((r) => !r.hidden);
    const matchingIds = new Set(matchingRows.map((r) => r.dataset.caseId));
    const totalItems = matchingRows.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / homePageSize));
    homePage = Math.max(1, Math.min(totalPages, homePage));
    const start = (homePage - 1) * homePageSize;
    const end = start + homePageSize;

    const pageIds = new Set(matchingRows.slice(start, end).map((r) => r.dataset.caseId));
    allRows.forEach((row) => {
      row.hidden = !pageIds.has(row.dataset.caseId);
    });
    allCards.forEach((card) => {
      card.hidden = !(matchingIds.has(card.dataset.caseId) && pageIds.has(card.dataset.caseId));
    });

    if (!homePaginationEl) return;
    homePaginationEl.dataset.totalPages = String(totalPages);
    homePaginationEl.dataset.currentPage = String(homePage);
    const statusCurrent = homePaginationEl.querySelector('[data-ds-page-current]');
    const statusTotal = homePaginationEl.querySelector('[data-ds-page-total]');
    const pagesContainer = homePaginationEl.querySelector('.ds-pagination__pages');
    const btnFirst = homePaginationEl.querySelector('[data-ds-page-action="first"]');
    const btnPrev = homePaginationEl.querySelector('[data-ds-page-action="prev"]');
    const btnNext = homePaginationEl.querySelector('[data-ds-page-action="next"]');
    const btnLast = homePaginationEl.querySelector('[data-ds-page-action="last"]');
    if (statusCurrent) statusCurrent.textContent = String(homePage);
    if (statusTotal) statusTotal.textContent = String(totalPages);
    if (btnFirst) btnFirst.disabled = homePage <= 1;
    if (btnPrev) btnPrev.disabled = homePage <= 1;
    if (btnNext) btnNext.disabled = homePage >= totalPages;
    if (btnLast) btnLast.disabled = homePage >= totalPages;

    if (pagesContainer) {
      const nums = [];
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i += 1) nums.push(i);
      } else if (homePage <= 3) {
        nums.push(1, 2, 3, '...', totalPages - 1, totalPages);
      } else if (homePage >= totalPages - 2) {
        nums.push(1, 2, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        nums.push(1, '...', homePage - 1, homePage, homePage + 1, '...', totalPages);
      }
      pagesContainer.innerHTML = nums.map((item) => (
        item === '...'
          ? '<span class="ds-pagination__ellipsis" aria-hidden="true">···</span>'
          : `<button type="button" class="ds-pagination__page${item === homePage ? ' is-active' : ''}" data-page="${item}"${item === homePage ? ' aria-current="page"' : ''}>${item}</button>`
      )).join('');
    }
  };

  if (homePaginationEl && !homePaginationEl.dataset.uxPagBound) {
    homePaginationEl.dataset.uxPagBound = 'true';
    homePaginationEl.addEventListener('click', (e) => {
      const pageBtn = e.target.closest('.ds-pagination__page[data-page]');
      const actionBtn = e.target.closest('[data-ds-page-action]');
      if (!pageBtn && !actionBtn) return;
      e.stopImmediatePropagation();
      const totalPages = Math.max(1, parseInt(homePaginationEl.dataset.totalPages || '1', 10) || 1);
      if (pageBtn) {
        homePage = Math.max(1, Math.min(totalPages, parseInt(pageBtn.dataset.page || '1', 10) || 1));
      } else if (actionBtn && !actionBtn.disabled) {
        const act = actionBtn.dataset.dsPageAction;
        if (act === 'first') homePage = 1;
        else if (act === 'prev') homePage = Math.max(1, homePage - 1);
        else if (act === 'next') homePage = Math.min(totalPages, homePage + 1);
        else if (act === 'last') homePage = totalPages;
      }
      syncHomePagination();
    }, true);

    homePaginationEl.querySelector('[data-ds-rows-dropdown]')?.addEventListener('ds-change', (e) => {
      const nextRows = parseInt(e.detail?.value || '10', 10);
      if (Number.isFinite(nextRows) && nextRows > 0) {
        homePageSize = nextRows;
        homePage = 1;
        syncHomePagination();
      }
    });
  }

  document.querySelectorAll('#accident-case-table th.ds-table__sortable').forEach((th) => {
    if (th.tabIndex < 0) th.tabIndex = 0;
    const syncAfterSort = () => {
      queueMicrotask(() => {
        if (!tableBody) return;
        const emptyRow = tableBody.querySelector('[data-case-empty]');
        if (emptyRow) tableBody.appendChild(emptyRow);
        const sortedIds = Array.from(tableBody.querySelectorAll('tr[data-case-row]'))
          .map((r) => r.dataset.caseId)
          .filter(Boolean);
        if (caseGridEl && sortedIds.length) {
          const cardsById = new Map(
            Array.from(caseGridEl.querySelectorAll('[data-case-card]')).map((card) => [card.dataset.caseId, card])
          );
          sortedIds.forEach((id) => {
            const card = cardsById.get(id);
            if (card) caseGridEl.appendChild(card);
          });
        }
        syncHomePagination();
      });
    };
    th.addEventListener('click', syncAfterSort);
    th.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        th.click();
      }
    });
  });

  const syncDetailSwitcherActiveState = () => {
    if (!breadcrumbSwitcherList) return;
    breadcrumbSwitcherList.innerHTML = store.cases
      .filter((c) => !c.archived || c.id === store.activeCaseId)
      .map((c) => {
        const isCurrent = c.id === store.activeCaseId;
        return `
          <button type="button" class="ds-select__option ds-dropdown__item" role="option" data-value="${esc(c.id)}" aria-selected="${isCurrent}"${isCurrent ? ' data-checked="true"' : ''}>
            <span class="ds-dropdown__check${isCurrent ? '' : ' ds-dropdown__check--empty'}">${isCurrent ? bridge.switcherCheckSvg : ''}</span>
            <span>${esc(c.id)}</span>
          </button>
        `;
      }).join('');
  };

  if (breadcrumbSwitcherList && !breadcrumbSwitcherList.dataset.uxSwitcherBound) {
    breadcrumbSwitcherList.dataset.uxSwitcherBound = 'true';
    breadcrumbSwitcherList.addEventListener('click', (e) => {
      const item = e.target.closest('.ds-dropdown__item, .ds-select__option');
      if (!item || item.disabled) return;
      e.stopPropagation();
      const nextId = item.dataset.value;
      const root = bridge.detailSwitcher;
      if (root) {
        root.dataset.dsOpen = 'false';
        root.querySelector('.ds-dropdown__trigger, .ds-breadcrumb__trigger')?.setAttribute('aria-expanded', 'false');
        const menu = root.querySelector('.ds-dropdown__menu, .ds-select__menu');
        if (menu) menu.hidden = true;
      }
      item.blur();
      if (nextId && nextId !== store.activeCaseId) {
        openCaseWorkbench(nextId, true);
      }
    });
  }

  const renderCaseQueueRows = () => {
    if (!tableBody) return;
    const emptyRow = tableBody.querySelector('[data-case-empty]');
    tableBody.querySelectorAll('tr[data-case-row]').forEach((r) => r.remove());

    const gridCardsHtml = [];

    store.cases.forEach((c, idx) => {
      const stageInfo = STAGE_META[c.stage] || STAGE_META.pending_chart;
      const thumbSrc = c.thumb || `./assets/video-thumbs/cam-0${(idx % 4) + 1}.jpg`;
      const rowPlacement = idx === 0 ? 'bottom-start' : 'top-start';
      const scenarioTitle = getCaseScenarioTitle(c);
      const chartCode = c.selectedChart || 'pending';
      const faultBias = getFaultBiasKey(c.baseInsuredPct, c.baseOpponentPct);
      const archiveActionHtml = `
        <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" data-action="archive-case" aria-label="Archive ${esc(c.id)}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10V22H2L2.00019 10H22Z"/><path d="M20 10V6H4.00016L4 10"/><path d="M18 6V2H6.00012L6 6"/><path d="M16 14L14.5 16H9.5L8 14"/></svg>
        </button>
      `;
      const cardArchiveActionHtml = `
        <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm ux-case-grid-card__action" data-action="archive-case" aria-label="Archive ${esc(c.id)}" title="Archive">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10V22H2L2.00019 10H22Z"/><path d="M20 10V6H4.00016L4 10"/><path d="M18 6V2H6.00012L6 6"/><path d="M16 14L14.5 16H9.5L8 14"/></svg>
        </button>
      `;

      const tr = document.createElement('tr');
      tr.dataset.caseRow = '';
      tr.dataset.caseId = c.id;
      tr.dataset.scenarioKey = c.scenario;
      tr.dataset.stage = c.stage;
      tr.dataset.state = String(stageInfo.step);
      tr.dataset.chartCode = chartCode;
      tr.dataset.faultBias = faultBias;
      tr.tabIndex = 0;
      if (c.archived) tr.dataset.archived = 'true';
      tr.innerHTML = `
        <td>
          <div class="ux-case-id-cell">
            <span class="ux-case-row-thumb" aria-hidden="true">
              <img class="ux-case-row-thumb__img" src="${esc(thumbSrc)}" alt="" decoding="async" />
            </span>
            <code>${esc(c.id)}</code>
          </div>
        </td>
        <td>${esc(c.plate)}</td>
        <td><span class="ds-badge ds-badge--pill ${stageInfo.badge}">${esc(stageInfo.label)}</span></td>
        <td>
          <div class="ux-case-scenario-cell">
            ${renderScenarioPillTooltipHtml(c, rowPlacement)}
            <span class="ux-case-scenario-cell__title">${esc(scenarioTitle)}</span>
          </div>
        </td>
        <td>
          <div class="ds-ratio-cell">
            ${renderSplitBarHtml({
              cls: 'ds-progress-bar ux-ratio-bar--sm ux-ratio-bar--neutral',
              role: 'progressbar',
              ariaLabel: `Base ratio ${c.baseRatio}`,
              valuenow: c.baseInsuredPct,
            })}
            <span class="ds-ratio-cell__value">${esc(c.baseRatio)}</span>
          </div>
        </td>
        <td class="ds-table__col-actions">${archiveActionHtml}</td>
      `;
      tr.querySelector('.ux-ratio-bar')?.style.setProperty('--ratio-a', String(clampRatioUnit(c.baseInsuredPct)));
      if (emptyRow) tableBody.insertBefore(tr, emptyRow);
      else tableBody.appendChild(tr);

      gridCardsHtml.push(renderCaseGridCardHtml({
        c,
        thumbSrc,
        stageInfo,
        actionBtnHtml: cardArchiveActionHtml,
      }));
    });

    if (caseGridEl) {
      caseGridEl.innerHTML = gridCardsHtml.join('');
      caseGridEl.querySelectorAll('.ux-ratio-bar').forEach((barEl) => {
        barEl.style.setProperty('--ratio-a', String(clampRatioUnit(barEl.getAttribute('aria-valuenow'))));
      });
    }

    syncDetailSwitcherActiveState();
    syncHomePagination();
  };

  bindSingleSelectFilterList(filterTriggerList, [
    ['all', 'All stages'],
    ['pending_analysis', 'Queued'],
    ['analyzing', 'Analysing'],
    ['undetermined', 'Needs input'],
    ['pending_chart', 'Select scenario'],
    ['pending_report', 'Validate evidence'],
    ['negotiating', 'Negotiating'],
    ['agreed', 'Settled'],
    ['closed', 'Closed'],
  ]);

  bindSingleSelectFilterList(scenarioFilterList, [
    ['all', 'All scenarios'],
    ['pending', 'Pending'],
    ...KNIA_CHART_CATALOG.map((ch) => [ch.code, scenarioLabel(ch)]),
  ]);

  bindSingleSelectFilterList(faultFilterList, [
    ['all', 'All splits'],
    ['counterparty', 'Counterparty majority'],
    ['equal', 'Equal (50 : 50)'],
    ['insured', 'Insured majority'],
  ]);

  // ── Navigation Views ──
  const viewSections = {
    cases: document.querySelector('[data-view="cases"]'),
    'case-detail': document.querySelector('[data-view="case-detail"]'),
    history: document.querySelector('[data-view="history"]'),
    archived: document.querySelector('[data-view="archived"]'),
    'rule-management': document.querySelector('[data-view="rule-management"]'),
  };

  const sidebarEl = document.querySelector('[data-ds-sidebar]');
  const sidebarCollapseBtn = sidebarEl?.querySelector('[data-ds-sidebar-collapse]');
  const sidebarBrandBtn = sidebarEl?.querySelector('.ds-sidebar__brand');
  let sidebarAutoCollapsed = false;
  let sidebarAnimToken = 0;
  let sidebarAnimTimer = 0;

  const closeSidebarPopups = () => {
    sidebarEl?.querySelectorAll('[data-ds-menu]').forEach((menuRoot) => {
      const isOpen = menuRoot.dataset.dsOpen === 'true' || !menuRoot.querySelector('.ds-menu__content')?.hidden;
      if (!isOpen) return;
      menuRoot.dataset.dsOpen = 'false';
      const trigger = menuRoot.querySelector('.ds-menu__trigger');
      const content = menuRoot.querySelector('.ds-menu__content');
      trigger?.setAttribute('aria-expanded', 'false');
      if (content) content.hidden = true;
    });
  };

  const syncSidebarCollapsedState = (collapsed, { animate = true } = {}) => {
    if (!sidebarEl) return;
    const next = Boolean(collapsed);
    const current = sidebarEl.dataset.collapsed === 'true';
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      || document.documentElement.dataset.reducedMotion === 'true';

    closeSidebarPopups();

    if (animate && !reduced && next !== current) {
      sidebarAnimToken += 1;
      const token = sidebarAnimToken;
      clearTimeout(sidebarAnimTimer);
      sidebarEl.dataset.animating = 'true';
      sidebarAnimTimer = window.setTimeout(() => {
        if (sidebarAnimToken === token) delete sidebarEl.dataset.animating;
      }, 280);
    } else if (!animate || reduced) {
      sidebarAnimToken += 1;
      clearTimeout(sidebarAnimTimer);
      delete sidebarEl.dataset.animating;
    }

    sidebarEl.dataset.collapsed = String(next);

    if (sidebarCollapseBtn) {
      const label = next ? 'Expand sidebar' : 'Collapse sidebar';
      sidebarCollapseBtn.setAttribute('aria-expanded', String(!next));
      sidebarCollapseBtn.setAttribute('aria-label', label);
      sidebarCollapseBtn.setAttribute('title', label);
    }

    if (sidebarBrandBtn) {
      sidebarBrandBtn.inert = next;
      sidebarBrandBtn.setAttribute('aria-hidden', String(next));
    }

    sidebarEl.querySelectorAll('.ds-nav__item, .ds-search-trigger, .ds-sidebar__account').forEach((item) => {
      if (next) {
        const tooltip = item.classList.contains('ds-search-trigger')
          ? 'Search (⌘K)'
          : item.querySelector('.ds-nav__label')?.textContent?.trim()
            || item.querySelector('.ds-sidebar__account-title')?.textContent?.trim()
            || item.getAttribute('aria-label')
            || '';
        if (tooltip) item.setAttribute('title', tooltip);
      } else {
        item.removeAttribute('title');
      }
    });
  };

  sidebarEl?.addEventListener('transitionend', (e) => {
    if (e.target === sidebarEl && e.propertyName === 'width') {
      clearTimeout(sidebarAnimTimer);
      delete sidebarEl.dataset.animating;
    }
  });

  const setSidebarCollapsed = (collapsed) => {
    syncSidebarCollapsedState(collapsed, { animate: true });
  };

  sidebarEl?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-ds-sidebar-collapse]');
    if (!btn) return;
    e.stopPropagation();
    sidebarAutoCollapsed = false;
    setSidebarCollapsed(sidebarEl.dataset.collapsed !== 'true');
  }, true);

  syncSidebarCollapsedState(sidebarEl?.dataset.collapsed === 'true', { animate: false });

  // ── Resizable Video Panel Split Divider (Default 40:60, Drag & Keyboard) ──
  const detailWorkspacesEl = document.querySelector('.ds-detail-workspaces');
  const splitResizerEl = document.querySelector('[data-ux-split-resizer]');
  const agentPanelEl = document.querySelector('[data-agent-panel]');
  const VIDEO_SPLIT_KEY = 'smt_ratio_video_panel_pct';
  const DEFAULT_VIDEO_SPLIT_PCT = 40;

  const getSplitBoundsPx = () => {
    const totalW = detailWorkspacesEl?.getBoundingClientRect().width || 0;
    if (!totalW) return { totalW: 0, minPx: 280, maxPx: 760 };
    const agentW = detailWorkspacesEl?.dataset.agentOpen === 'true'
      ? (agentPanelEl?.getBoundingClientRect().width || 340)
      : 0;
    const minPx = Math.min(totalW * 0.4, Math.max(280, totalW * 0.25));
    const maxPx = Math.max(minPx, Math.min(totalW * 0.65, totalW - agentW - 360));
    return { totalW, minPx, maxPx };
  };

  const applyVideoPanelPct = (rawPct, persist = false) => {
    if (!detailWorkspacesEl) return;
    const { totalW, minPx, maxPx } = getSplitBoundsPx();
    const minPct = totalW > 0 ? Math.max(25, (minPx / totalW) * 100) : 25;
    const maxPct = totalW > 0 ? Math.min(65, Math.max(minPct, (maxPx / totalW) * 100)) : 65;
    const pct = Math.max(minPct, Math.min(maxPct, Number(rawPct) || DEFAULT_VIDEO_SPLIT_PCT));
    detailWorkspacesEl.style.setProperty('--video-panel-w', `${pct.toFixed(2)}%`);
    if (splitResizerEl) {
      splitResizerEl.setAttribute('aria-valuenow', String(Math.round(pct)));
    }
    if (typeof syncReanalyseSheetPosition === 'function') {
      requestAnimationFrame(syncReanalyseSheetPosition);
    }
    if (persist) {
      try { window.localStorage?.setItem(VIDEO_SPLIT_KEY, pct.toFixed(2)); } catch {}
    }
  };

  try {
    const savedPct = parseFloat(window.localStorage?.getItem(VIDEO_SPLIT_KEY) || '');
    if (Number.isFinite(savedPct)) applyVideoPanelPct(savedPct, false);
  } catch {}

  if (splitResizerEl && detailWorkspacesEl) {
    let draggingSplit = false;
    let splitMoveRaf = 0;
    let pendingClientX = 0;

    const updateFromClientX = (clientX, persist = false) => {
      const rect = detailWorkspacesEl.getBoundingClientRect();
      const { totalW, minPx, maxPx } = getSplitBoundsPx();
      if (!totalW) return;
      const targetPx = Math.max(minPx, Math.min(maxPx, clientX - rect.left));
      applyVideoPanelPct((targetPx / totalW) * 100, persist);
    };

    splitResizerEl.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      draggingSplit = true;
      detailWorkspacesEl.dataset.resizing = 'true';
      splitResizerEl.dataset.dragging = 'true';
      splitResizerEl.setPointerCapture?.(e.pointerId);
      updateFromClientX(e.clientX, false);
    });

    splitResizerEl.addEventListener('pointermove', (e) => {
      if (!draggingSplit) return;
      pendingClientX = e.clientX;
      if (!splitMoveRaf) {
        splitMoveRaf = requestAnimationFrame(() => {
          splitMoveRaf = 0;
          if (draggingSplit) updateFromClientX(pendingClientX, false);
        });
      }
    });

    const stopSplitDrag = (e, commit = true) => {
      if (!draggingSplit) return;
      draggingSplit = false;
      if (splitMoveRaf) {
        cancelAnimationFrame(splitMoveRaf);
        splitMoveRaf = 0;
      }
      delete detailWorkspacesEl.dataset.resizing;
      delete splitResizerEl.dataset.dragging;
      try {
        if (splitResizerEl.hasPointerCapture?.(e.pointerId)) {
          splitResizerEl.releasePointerCapture(e.pointerId);
        }
      } catch {}
      if (commit) updateFromClientX(e.clientX, true);
    };

    splitResizerEl.addEventListener('pointerup', (e) => stopSplitDrag(e, true));
    splitResizerEl.addEventListener('pointercancel', (e) => stopSplitDrag(e, false));

    splitResizerEl.addEventListener('dblclick', () => {
      applyVideoPanelPct(DEFAULT_VIDEO_SPLIT_PCT, true);
    });

    splitResizerEl.addEventListener('keydown', (e) => {
      const curPct = parseFloat(detailWorkspacesEl.style.getPropertyValue('--video-panel-w')) || DEFAULT_VIDEO_SPLIT_PCT;
      const step = e.shiftKey ? 5 : 2;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        applyVideoPanelPct(curPct - step, true);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        applyVideoPanelPct(curPct + step, true);
      } else if (e.key === 'Home') {
        e.preventDefault();
        applyVideoPanelPct(DEFAULT_VIDEO_SPLIT_PCT, true);
      }
    });
  }

  const setActiveNavView = (navId) => {
    const prevNav = store.activeNav;
    store.activeNav = navId;
    window.SMT_RATIO_APP.activeNav = navId;
    if (navId === 'case-detail' && prevNav !== 'case-detail') {
      sidebarAutoCollapsed = sidebarEl?.dataset.collapsed !== 'true';
      if (sidebarAutoCollapsed) setSidebarCollapsed(true);
    } else if (navId !== 'case-detail' && sidebarAutoCollapsed) {
      sidebarAutoCollapsed = false;
      setSidebarCollapsed(false);
    }
    bridge.setVideoPlaying(false);
    if (navId !== 'case-detail') {
      hideCondThumbTip();
      closeStep1ReanalyseSheet({ discardDraft: true });
      store.evidenceDraft = null;
      bridge.setTimelineDraftMode?.(false);
      bridge.setVideoFullView?.(false);
      bridge.stopCaseAnalysis();
      bridge.stopStep2Analysis?.();
      bridge.stopStep3Analysis?.();
    }

    Object.entries(viewSections).forEach(([key, sec]) => {
      if (sec) sec.hidden = key !== (navId === 'home' ? 'cases' : navId);
    });

    if (navId === 'history') renderGlobalHistoryView();
    if (navId === 'archived') renderArchivedView();
    if (navId === 'rule-management') renderRuleManagementView();
  };

  document.querySelector('.ds-sidebar .ds-nav')?.addEventListener('click', (e) => {
    const link = e.target.closest('a.ds-nav__item');
    if (!link) return;
    const navId = link.dataset.navId || 'home';
    setTimeout(() => setActiveNavView(navId), 0);
  });
  document.querySelector('[data-action="back-to-cases"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveNavView('home');
    renderCaseQueueRows();
  });

  // ── Left Video Panel Unified Timeline & Lightbox ──
  const videoJumpImpactBtn = document.querySelector('[data-action="video-jump-impact"]');
  const gridTimelineEl = document.querySelector('[data-ux-grid-timeline]');
  const videoCanvasEl = document.querySelector('[data-video-canvas]');
  let stageJumpTimer = 0;

  const isRawVideoState = (c) => Boolean(!c || (!c.analysisDone && c.stage !== 'undetermined'));

  const parseTimeSec = (mmss) => {
    const parts = String(mmss).split(':');
    if (parts.length !== 2) return 12.4;
    return (parseInt(parts[0], 10) || 0) * 60 + (parseFloat(parts[1]) || 0);
  };

  const renderStageOverlay = () => {
    videoCanvasEl?.querySelectorAll('[data-video-grid-cell][data-cond-focus]').forEach((cell) => {
      delete cell.dataset.condFocus;
    });
    videoCanvasEl?.querySelectorAll('[data-ux-grid-cond-tag]').forEach((tag) => tag.remove());
  };

  const flashActiveVideoStage = () => {
    if (!videoCanvasEl) return;
    delete videoCanvasEl.dataset.jumpFlash;
    void videoCanvasEl.offsetWidth;
    videoCanvasEl.dataset.jumpFlash = 'true';
    clearTimeout(stageJumpTimer);
    stageJumpTimer = window.setTimeout(() => {
      delete videoCanvasEl.dataset.jumpFlash;
    }, 260);
  };

  const clearTimelineRangeFocus = (c, refreshTimeline = true) => {
    store.activeTimelineRange = null;
    store.activeStep2EvidenceTag = null;
    bridge.setTimelineFocusRange?.(null);
    document.querySelectorAll('[data-ux-ev-tag-key][data-active="true"]').forEach((el) => {
      el.dataset.active = 'false';
    });
    if (refreshTimeline && c) renderVideoTimeline(c);
  };

  const jumpToScenarioCondition = (c, ch, cond) => {
    if (!c || !ch || !cond) return;
    if (store.activeTimelineRange) clearTimelineRangeFocus(c, false);
    if (store.activeStep2EvidenceTag) {
      store.activeStep2EvidenceTag = null;
    }
    const sec = parseTimeSec(cond.time);
    store.activeConditionTarget = {
      key: `${ch.code}:${cond.id}`,
      sec,
      cam: cond.cam,
      frame: cond.frame,
      highlight: cond.highlight,
      hud: cond.hud,
      reticle: cond.reticle || 'impact',
    };
    bridge.setVideoPlaying(false);
    bridge.setScrubberValue(sec);
    bridge.setActiveCamera(String(cond.cam));
    flashActiveVideoStage();
    renderStageOverlay(store.activeConditionTarget);
  };

  const syncLinkedEvidenceHighlight = () => {
    const activeEvKey = store.activeTimelineRange?.key || store.activeStep2EvidenceTag?.key || '';
    const activePillKey = store.activeTimelineRange?.key || store.activeStep2EvidenceTag?.pillKey || activeEvKey;
    document.querySelectorAll('[data-ux-ev-tag-key]').forEach((el) => {
      el.dataset.active = String(Boolean(activePillKey) && el.dataset.uxEvTagKey === activePillKey);
    });
    document.querySelectorAll('[data-ux-ev-item-key]').forEach((el) => {
      el.dataset.active = String(Boolean(activeEvKey) && el.dataset.uxEvItemKey === activeEvKey);
    });
  };

  const jumpToStep2Keyframe = (c, chart, ev, momentIdx = -1) => {
    if (!c || !chart || !ev) return;
    if (store.activeTimelineRange) clearTimelineRangeFocus(c, false);
    const moments = Array.isArray(ev.moments) ? ev.moments : [];
    const targetM = momentIdx >= 0 && moments[momentIdx] ? moments[momentIdx] : null;
    const sec = targetM
      ? (Number.isFinite(targetM.cam1Sec) ? targetM.cam1Sec : (Number.isFinite(targetM.masterSec) ? Math.max(0, Math.min(24, targetM.masterSec - 2.6)) : parseTimeSec(targetM.time || ev.time)))
      : parseTimeSec(ev.time);
    const cam = Number(targetM?.cam || ev.cam || 1);
    const evKey = getEvidenceTagKey(chart, ev);
    const pillKey = targetM ? `${evKey}:m${momentIdx}` : evKey;
    store.activeStep2EvidenceTag = { chartCode: chart.code, evId: ev.id, key: evKey, pillKey };
    store.activeConditionTarget = {
      key: pillKey,
      sec,
      cam,
      frame: targetM && Number.isFinite(targetM.masterSec)
        ? formatMasterShort(targetM.masterSec)
        : `0:${String(targetM?.time || ev.time || '').replace(/^00:/, '')}`,
      highlight: ev.title,
      hud: targetM?.hud || ev.hud || ev.title,
      reticle: targetM?.reticle || ev.reticle || 'impact',
    };
    bridge.setVideoPlaying(false);
    bridge.setScrubberValue(sec);
    bridge.setActiveCamera(String(cam));
    flashActiveVideoStage();
    renderStageOverlay(store.activeConditionTarget);
    renderVideoTimeline(c);
    syncLinkedEvidenceHighlight();
  };

  const jumpToRangeKeyframe = (c, kf) => {
    if (!c || !kf) return;
    store.activeConditionTarget = {
      key: kf.id,
      sec: kf.cam1Sec,
      cam: kf.cam,
      frame: `0:${String(kf.time || '').replace(/^00:/, '')}`,
      highlight: kf.label,
      hud: kf.hud || kf.label,
      reticle: kf.reticle || 'impact',
    };
    bridge.setVideoPlaying(false);
    bridge.setScrubberValue(kf.cam1Sec);
    bridge.setActiveCamera(String(kf.cam));
    flashActiveVideoStage();
    renderStageOverlay(store.activeConditionTarget);
    syncLinkedEvidenceHighlight();
  };

  const focusStep2TimelineRange = (c, chart, ev, { preserveSec = false } = {}) => {
    if (!c || !chart || !ev) return;
    const startSec = parseTimeSec(ev.startTime);
    const endSec = parseTimeSec(ev.endTime);
    const keyframes = (ev.keyframes || []).map((kf) => {
      const cam1Sec = parseTimeSec(kf.time);
      return {
        ...kf,
        cam1Sec,
        masterSec: 15.0 + (cam1Sec - 12.4),
      };
    });
    const evKey = getEvidenceTagKey(chart, ev);
    const rangeObj = {
      key: evKey,
      startTime: ev.startTime,
      endTime: ev.endTime,
      startSec,
      endSec,
      startMasterSec: 15.0 + (startSec - 12.4),
      endMasterSec: 15.0 + (endSec - 12.4),
      cam: ev.cam,
      hud: ev.hud || ev.title,
      reticle: ev.reticle || 'lane',
      keyframes,
    };
    store.activeTimelineRange = rangeObj;
    store.activeStep2EvidenceTag = { chartCode: chart.code, evId: ev.id, key: evKey };
    if (!preserveSec) store.activeConditionTarget = null;
    bridge.setVideoPlaying(false);
    bridge.setTimelineFocusRange?.(rangeObj);
    if (!preserveSec) {
      bridge.setScrubberValue(startSec);
      bridge.setActiveCamera(String(ev.cam));
      flashActiveVideoStage();
      renderStageOverlay(rangeObj);
    }
    renderVideoTimeline(c);
    syncLinkedEvidenceHighlight();
  };

  const getEvidenceTagKey = (chart, ev, idx = 0) => `ev:${chart.code}:${ev.id ?? idx}`;

  const isEvidenceTagActive = (evKey, isRange) => (
    isRange
      ? store.activeTimelineRange?.key === evKey
      : (!store.activeTimelineRange && store.activeConditionTarget?.key === evKey)
  );

  const getCamShortName = (camSlot) => (
    ({ 1: 'Front', 2: 'Rear', 3: 'Other', 4: 'CCTV' })[Number(camSlot)] || `Cam ${camSlot}`
  );

  const renderCueTrackHtml = (chart, ev, idx = 0) => {
    const evId = ev.id ?? idx;
    const evKey = getEvidenceTagKey(chart, ev, idx);
    const isActive = isEvidenceTagActive(evKey, true);
    const startSec = parseTimeSec(ev.startTime || '00:10.0');
    const endSec = Math.max(startSec + 0.5, parseTimeSec(ev.endTime || '00:12.4'));
    const camName = getCamShortName(ev.cam);
    const cueLabel = `${camName} · ${formatEvidenceCue(ev)}`;
    const mapX = (sec) => Math.max(4, Math.min(156, Math.round((Math.max(0, Math.min(30, sec)) / 30) * 152) + 4));
    const x1 = Math.min(138, mapX(startSec));
    const segW = Math.max(18, Math.min(156 - x1, mapX(endSec) - x1));
    return `
      <button type="button" class="ux-cue-track" data-ux-ev-jump="${esc(evId)}" data-ux-ev-tag-key="${esc(evKey)}" data-active="${isActive}" aria-label="${esc(ev.title)} · ${esc(cueLabel)}">
        <span class="ux-cue-track__cam">${esc(camName)}</span>
        <span class="ux-cue-track__time ux-num">${esc(formatSecMMSS(startSec))}</span>
        <svg class="ux-cue-track__svg" viewBox="0 0 160 14" width="156" height="14" fill="none" aria-hidden="true">
          <rect class="ux-cue-track__bg" x="2" y="5" width="156" height="4" rx="2" />
          <rect class="ux-cue-track__seg" x="${x1}" y="5" width="${segW}" height="4" rx="2" />
        </svg>
        <span class="ux-cue-track__time ux-num">${esc(formatSecMMSS(endSec))}</span>
      </button>
    `;
  };

  const selectEvidenceTag = (c, chart, ev, momentIdx = -1) => {
    if (!c || !chart || !ev) return;
    const evKey = getEvidenceTagKey(chart, ev);
    if (ev.type === 'range') {
      if (store.activeTimelineRange?.key === evKey) {
        store.activeConditionTarget = null;
        renderStageOverlay(null);
        clearTimelineRangeFocus(c, true);
        syncLinkedEvidenceHighlight();
        return;
      }
      focusStep2TimelineRange(c, chart, ev);
    } else {
      const targetKey = momentIdx >= 0 ? `${evKey}:m${momentIdx}` : evKey;
      if (!store.activeTimelineRange && store.activeConditionTarget?.key === targetKey) {
        store.activeConditionTarget = null;
        store.activeStep2EvidenceTag = null;
        renderStageOverlay(null);
        syncLinkedEvidenceHighlight();
        return;
      }
      jumpToStep2Keyframe(c, chart, ev, momentIdx);
    }
  };

  const bindEvidenceTagClicks = (containerEl, c, chart, list) => {
    if (!containerEl) return;
    containerEl.querySelectorAll('[data-ux-ev-jump]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const ev = list.find((x, i) => String(x.id ?? i) === String(btn.dataset.uxEvJump));
        if (ev) selectEvidenceTag(c, chart, ev);
      });
    });
    containerEl.querySelectorAll('[data-ux-ev-moment-jump]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ev = list.find((x, i) => String(x.id ?? i) === String(btn.dataset.uxEvMomentJump));
        const mIdx = Number(btn.dataset.uxEvMomentIdx);
        if (ev) selectEvidenceTag(c, chart, ev, Number.isFinite(mIdx) ? mIdx : 0);
      });
    });
  };

  const formatSecMMSS = (sec) => {
    const clamped = Math.max(0, Number(sec) || 0);
    const mins = Math.floor(clamped / 60);
    const rem = clamped - mins * 60;
    const whole = Math.floor(rem);
    const tenths = Math.round((rem - whole) * 10);
    const adjWhole = tenths === 10 ? whole + 1 : whole;
    const adjTenths = tenths === 10 ? 0 : tenths;
    return `${String(mins).padStart(2, '0')}:${String(adjWhole).padStart(2, '0')}.${adjTenths}`;
  };

  const formatSecShort = (sec) => formatSecMMSS(sec).replace(/^00:/, '0:');

  const CAM_META_FALLBACK = [
    { slot: 1, short: 'Front', label: 'Front', masterStartSec: 2.6, durationSec: 24.0 },
    { slot: 2, short: 'Rear', label: 'Rear', masterStartSec: 6.6, durationSec: 18.0 },
    { slot: 3, short: 'Other', label: 'Other', masterStartSec: 10.5, durationSec: 13.5 },
    { slot: 4, short: 'CCTV', label: 'CCTV', masterStartSec: 0.0, durationSec: 30.0 },
  ];

  const buildEvidenceKeyframeMoments = (c, ev) => {
    const baseSec = parseTimeSec(ev?.time || '00:12.4');
    const primaryCam = Math.max(1, Math.min(4, Number(ev?.cam) || 1));
    const camSpecs = CAM_META_FALLBACK.map((fb) => {
      const match = (c?.videos || []).find((v) => v.slot === fb.slot);
      return {
        ...fb,
        masterStartSec: match?.masterStartSec ?? fb.masterStartSec,
        durationSec: match?.durationSec ?? fb.durationSec,
      };
    });

    let momentDefs;
    if (ev?.type === 'range') {
      const sSec = parseTimeSec(ev.startTime || '00:09.6');
      const eSec = Math.max(sSec + 0.6, parseTimeSec(ev.endTime || formatSecMMSS(Math.min(24, sSec + 1.6))));
      const existingKfs = Array.isArray(ev?.keyframes) ? ev.keyframes : [];
      if (existingKfs.length >= 3) {
        momentDefs = existingKfs.map((kf, i) => ({
          id: kf.id || `${ev.id || 'kf'}-k${i}`,
          label: kf.label || `Keyframe ${i + 1}`,
          cam1Sec: parseTimeSec(kf.time || ev.startTime || '00:09.6'),
          hud: kf.hud || kf.label || `Keyframe ${i + 1}`,
          isPrimary: i === 0,
          reticle: kf.reticle || ev.reticle || 'lane',
        }));
      } else {
        const kfCount = 4;
        momentDefs = Array.from({ length: kfCount }, (_, i) => {
          const seed = existingKfs[i];
          const sec = seed?.time
            ? parseTimeSec(seed.time)
            : Number((sSec + ((eSec - sSec) * i) / (kfCount - 1)).toFixed(1));
          return {
            id: seed?.id || `${ev.id || 'kf'}-k${i}`,
            label: seed?.label || `Keyframe ${i + 1}`,
            cam1Sec: Math.max(0, Math.min(24, sec)),
            hud: seed?.hud || seed?.label || `Keyframe ${i + 1}`,
            isPrimary: i === 0,
            reticle: seed?.reticle || ev.reticle || 'lane',
          };
        });
      }
    } else if (Array.isArray(ev?.moments) && ev.moments.length) {
      momentDefs = ev.moments;
    } else {
      momentDefs = [
        { id: `${ev?.id || 'kf'}-m0`, label: 'Pre-event', cam1Sec: Math.max(0.4, baseSec - 0.4), hud: `Pre · ${ev?.hud || ev?.title || ''}`, isPrimary: false, reticle: 'lane' },
        { id: `${ev?.id || 'kf'}-m1`, label: ev?.hud || ev?.title || 'Peak', cam1Sec: baseSec, hud: ev?.hud || ev?.title || '', isPrimary: true, reticle: ev?.reticle || 'impact' },
        { id: `${ev?.id || 'kf'}-m2`, label: 'Follow-through', cam1Sec: Math.min(23.6, baseSec + 0.4), hud: `Post · ${ev?.hud || ev?.title || ''}`, isPrimary: false, reticle: ev?.reticle || 'impact' },
      ];
    }

    const moments = momentDefs.map((m) => {
      const mCam = m?.cam ? Math.max(1, Math.min(4, Number(m.cam) || primaryCam)) : null;
      const cam1Sec = typeof m.cam1Sec === 'number'
        ? m.cam1Sec
        : (typeof m.masterSec === 'number' ? Math.max(0, Math.min(24, m.masterSec - 2.6)) : parseTimeSec(m.time || ev.time));
      const masterSec = typeof m.masterSec === 'number' ? m.masterSec : 15.0 + (cam1Sec - 12.4);
      const frameCam = mCam || primaryCam;
      const frames = camSpecs.map((cam) => {
        const localSec = Math.max(0, Math.min(cam.durationSec, masterSec - cam.masterStartSec));
        return {
          cam: cam.slot,
          camShort: cam.short,
          camLabel: cam.label,
          localSec,
          localTime: formatSecShort(localSec),
          frameNo: `F${Math.max(1, Math.round(localSec * 60))}`,
          imgSrc: `./assets/video-thumbs/cam-0${cam.slot}.jpg`,
          isPrimaryCam: cam.slot === frameCam,
          reticle: cam.slot === frameCam ? (m.reticle || ev.reticle || 'impact') : 'lane',
        };
      });
      return {
        id: m.id,
        label: m.label,
        cam: mCam,
        cam1Sec,
        masterSec,
        time: formatSecMMSS(cam1Sec),
        shortTime: typeof m.masterSec === 'number' ? formatMasterShort(masterSec) : formatSecShort(cam1Sec),
        hud: m.hud || m.label,
        isPrimary: Boolean(m.isPrimary),
        reticle: m.reticle || ev.reticle || 'impact',
        frames,
      };
    });

    const primaryMomentIdx = Math.max(0, moments.findIndex((m) => m.isPrimary));
    const totalCount = ev?.type === 'range'
      ? moments.length
      : moments.reduce((sum, m) => sum + m.frames.length, 0);
    return { moments, primaryMomentIdx, primaryCam, totalCount };
  };

  const renderEvidenceKeyframeStackHtml = (c, chart, ev, idx = 0) => {
    const evId = ev.id ?? idx;
    const { moments, primaryMomentIdx, primaryCam, totalCount } = buildEvidenceKeyframeMoments(c, ev);
    const primaryMoment = moments[primaryMomentIdx] || moments[0];
    let previewFrames;
    if (ev?.type === 'range') {
      previewFrames = moments
        .slice(0, 3)
        .map((m) => m.frames.find((f) => f.cam === primaryCam) || m.frames[0])
        .filter(Boolean);
    } else if (Array.isArray(ev?.moments) && ev.moments.length > 1) {
      previewFrames = moments
        .slice(0, 3)
        .map((m) => m.frames.find((f) => f.cam === (m.cam || primaryCam)) || m.frames[0])
        .filter(Boolean);
      if (previewFrames.length < 3 && primaryMoment?.frames?.length) {
        const usedCams = new Set(previewFrames.map((f) => f.cam));
        const camOrder = [1, 4, 2, 3];
        for (const slot of camOrder) {
          if (previewFrames.length >= 3) break;
          if (!usedCams.has(slot)) {
            const extra = primaryMoment.frames.find((f) => f.cam === slot);
            if (extra) {
              previewFrames.push(extra);
              usedCams.add(slot);
            }
          }
        }
      }
    } else {
      const camOrder = [primaryCam, 1, 4, 2, 3].filter((v, i, arr) => arr.indexOf(v) === i);
      previewFrames = camOrder
        .slice(0, 3)
        .map((slot) => primaryMoment.frames.find((f) => f.cam === slot))
        .filter(Boolean);
    }
    const remainingCount = Math.max(0, totalCount - previewFrames.length);

    return `
      <div class="ux-ev-kf-row">
        <button type="button" class="ux-ev-kf-stack" data-ux-ev-kf-open="${esc(evId)}" data-ux-ev-kf-moment="${primaryMomentIdx}" data-ux-ev-kf-cam="${primaryCam}" data-ux-ev-kf-view="single" aria-label="View all ${totalCount} keyframes for ${esc(ev.title)}">
          ${previewFrames.map((pf) => `
            <span class="ux-ev-kf-thumb" aria-hidden="true">
              <img class="ux-ev-kf-thumb__img" src="${pf.imgSrc}" alt="" decoding="async" />
            </span>
          `).join('')}
          ${remainingCount > 0 ? `<span class="ux-ev-kf-more" aria-hidden="true">+${remainingCount}</span>` : ''}
        </button>
      </div>
    `;
  };

  const LB_ARROW_LEFT_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="1.8" stroke-miterlimit="16"/></svg>';
  const LB_ARROW_RIGHT_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.00005 6L15 12L9 18" stroke="currentColor" stroke-width="1.8" stroke-miterlimit="16"/></svg>';
  const LB_IMAGE_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 21V3H3V21H21Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M5 21L15 12L21 16" stroke="currentColor" stroke-width="1.5"/></svg>';
  const LB_GRID_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 2V10H2V2H10Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M22 2V10H14V2H22Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M22 14V22H14V14H22Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 14V22H2V14H10Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';

  let activeLightboxState = null;

  const setImgSrcIfChanged = (imgEl, src, alt) => {
    if (!imgEl) return;
    if (imgEl.getAttribute('src') !== src) imgEl.setAttribute('src', src);
    if (alt !== undefined && imgEl.getAttribute('alt') !== alt) imgEl.setAttribute('alt', alt);
  };

  const setReticleIfChanged = (el) => {
    if (!el) return;
    el.dataset.reticleKey = '';
    el.innerHTML = '';
    el.hidden = true;
  };

  const syncKeyframeModalInPlace = () => {
    const st = activeLightboxState;
    const dlg = dialogs.frameLightbox;
    if (!st || !dlg) return;
    const titleEl = dlg.querySelector('[data-ux-lightbox-title]');
    const subtitleEl = dlg.querySelector('[data-ux-lightbox-subtitle]');
    const bodyEl = dlg.querySelector('[data-ux-lightbox-body]');
    if (!bodyEl) return;

    const isRangeGallery = st.ev?.type === 'range';
    const activeMoment = st.moments[st.momentIdx] || st.moments[0];
    const activeFrame = activeMoment.frames.find((f) => f.cam === st.activeCam) || activeMoment.frames[0];

    if (titleEl) titleEl.textContent = st.ev.title || 'Keyframe inspection';
    if (subtitleEl) {
      if (isRangeGallery) {
        const sLabel = formatSecShort(parseTimeSec(st.ev.startTime || '00:09.6'));
        const eLabel = formatSecShort(parseTimeSec(st.ev.endTime || '00:11.2'));
        subtitleEl.textContent = `${getCamShortName(st.activeCam)} · ${sLabel}–${eLabel} · ${st.moments.length} keyframes`;
      } else {
        subtitleEl.textContent = `${st.totalCount} keyframes · ${st.moments.length} moments × 4 cams`;
      }
    }

    const kfMetaEl = bodyEl.querySelector('[data-ux-lb-kf-meta]');
    if (kfMetaEl) {
      kfMetaEl.textContent = `Keyframe ${st.momentIdx + 1} of ${st.moments.length} · ${activeMoment.shortTime}`;
    }

    bodyEl.querySelectorAll('[data-ux-lb-moment]').forEach((btn) => {
      const mIdx = Number(btn.dataset.uxLbMoment);
      btn.setAttribute('aria-selected', String(mIdx === st.momentIdx));
    });

    const prevBtn = bodyEl.querySelector('[data-ux-lb-prev-moment]');
    const nextBtn = bodyEl.querySelector('[data-ux-lb-next-moment]');
    const stagePrevBtn = bodyEl.querySelector('[data-ux-lb-stage-prev]');
    const stageNextBtn = bodyEl.querySelector('[data-ux-lb-stage-next]');
    const posEl = bodyEl.querySelector('[data-ux-lb-pos]');
    if (prevBtn) prevBtn.disabled = st.momentIdx <= 0;
    if (nextBtn) nextBtn.disabled = st.momentIdx >= st.moments.length - 1;
    const totalNavItems = isRangeGallery
      ? st.moments.length
      : st.moments.reduce((sum, m) => sum + (m.frames?.length || 0), 0);
    if (stagePrevBtn) stagePrevBtn.disabled = totalNavItems <= 1;
    if (stageNextBtn) stageNextBtn.disabled = totalNavItems <= 1;
    if (posEl) posEl.textContent = `${st.momentIdx + 1}/${st.moments.length}`;

    bodyEl.querySelectorAll('[data-ux-lb-view]').forEach((btn) => {
      const isSelected = btn.dataset.uxLbView === st.viewMode;
      btn.setAttribute('aria-pressed', String(isSelected));
      btn.setAttribute('aria-selected', String(isSelected));
      btn.dataset.active = String(isSelected);
    });

    const singlePane = bodyEl.querySelector('[data-ux-lb-single-pane]');
    const gridPane = bodyEl.querySelector('[data-ux-lb-grid-pane]');
    if (singlePane) singlePane.hidden = st.viewMode === 'grid';
    if (gridPane) {
      gridPane.hidden = st.viewMode !== 'grid';
      gridPane.setAttribute('aria-label', `4 synchronized cameras at ${activeMoment.shortTime}`);
    }

    const mainImg = bodyEl.querySelector('[data-ux-lb-main-img]');
    const mainReticle = bodyEl.querySelector('[data-ux-lb-main-reticle]');
    const hudCam = bodyEl.querySelector('[data-ux-lb-hud-cam]');
    const hudTime = bodyEl.querySelector('[data-ux-lb-hud-time]');
    const hudDesc = bodyEl.querySelector('[data-ux-lb-hud-desc]');
    setImgSrcIfChanged(mainImg, activeFrame.imgSrc, `${activeMoment.label} · ${activeFrame.camLabel}`);
    setReticleIfChanged(mainReticle, activeFrame.reticle);
    if (hudCam) hudCam.textContent = activeFrame.camLabel;
    if (hudTime) hudTime.textContent = isRangeGallery ? activeMoment.shortTime : activeFrame.localTime;
    if (hudDesc) hudDesc.textContent = activeMoment.hud;

    const camGroup = bodyEl.querySelector('.ux-lb-cam-group');
    const camStrip = bodyEl.querySelector('.ux-lb-cam-strip');
    if (isRangeGallery) {
      if (camGroup) camGroup.setAttribute('aria-label', `Range keyframes (${st.moments.length})`);
      if (camStrip) camStrip.setAttribute('aria-label', 'Keyframes in range');
      st.moments.forEach((m, mIdx) => {
        const kfFrame = m.frames.find((f) => f.cam === st.activeCam) || m.frames[0];
        const card = bodyEl.querySelector(`.ux-lb-cam-card[data-ux-lb-kf-idx="${mIdx}"]`);
        if (card && kfFrame) {
          const isActive = mIdx === st.momentIdx;
          card.setAttribute('aria-selected', String(isActive));
          card.dataset.active = String(isActive);
          setImgSrcIfChanged(card.querySelector('.ux-lb-cam-card__img'), kfFrame.imgSrc, '');
          const nameEl = card.querySelector('[data-ux-lb-cam-name]');
          const timeEl = card.querySelector('[data-ux-lb-cam-time]');
          if (nameEl) nameEl.textContent = mIdx === st.primaryMomentIdx ? 'Main' : `Frame ${mIdx + 1}`;
          if (timeEl) timeEl.textContent = m.shortTime;
        }
      });
    } else {
      if (camGroup) camGroup.setAttribute('aria-label', `4 camera angles at ${activeMoment.shortTime}`);
      if (camStrip) camStrip.setAttribute('aria-label', `Camera angles for ${activeMoment.shortTime}`);
      activeMoment.frames.forEach((fr) => {
        const card = bodyEl.querySelector(`.ux-lb-cam-card[data-ux-lb-cam="${fr.cam}"]`);
        if (card) {
          const isActive = fr.cam === st.activeCam;
          card.setAttribute('aria-selected', String(isActive));
          card.dataset.active = String(isActive);
          setImgSrcIfChanged(card.querySelector('.ux-lb-cam-card__img'), fr.imgSrc, '');
          const nameEl = card.querySelector('[data-ux-lb-cam-name]');
          const timeEl = card.querySelector('[data-ux-lb-cam-time]');
          if (nameEl) nameEl.textContent = fr.camShort;
          if (timeEl) timeEl.textContent = fr.localTime;
        }
      });
    }

    activeMoment.frames.forEach((fr) => {
      const cell = bodyEl.querySelector(`.ux-lb-grid-cell[data-ux-lb-grid-cam="${fr.cam}"]`);
      if (cell) {
        const isActive = fr.cam === st.activeCam;
        cell.dataset.active = String(isActive);
        cell.setAttribute('aria-label', `Focus ${fr.camLabel} at ${fr.localTime}`);
        setImgSrcIfChanged(cell.querySelector('.ux-lb-stage__img'), fr.imgSrc, `${activeMoment.label} · ${fr.camLabel}`);
        const cellReticle = cell.querySelector('[data-ux-lb-grid-reticle]');
        if (cellReticle) {
          setReticleIfChanged(cellReticle, '');
        }
        const camLabelEl = cell.querySelector('[data-ux-lb-grid-camlabel]');
        const cellTimeEl = cell.querySelector('[data-ux-lb-grid-time]');
        if (camLabelEl) camLabelEl.textContent = fr.camLabel;
        if (cellTimeEl) cellTimeEl.textContent = fr.localTime;
      }
    });

    store.activeStep2EvidenceTag = { chartCode: st.chart.code, evId: st.ev.id, key: st.evKey };
    store.activeConditionTarget = {
      key: st.evKey,
      sec: activeMoment.cam1Sec,
      cam: activeFrame.cam,
      frame: activeMoment.shortTime,
      highlight: activeMoment.label,
      hud: activeMoment.hud,
      reticle: activeFrame.reticle,
    };
    bridge.setVideoPlaying(false);
    bridge.setScrubberValue(activeMoment.cam1Sec);
    bridge.setActiveCamera(String(activeFrame.cam));
    renderStageOverlay(store.activeConditionTarget);
    syncLinkedEvidenceHighlight();
  };

  const mountKeyframeModalSkeleton = (bodyEl, st) => {
    if (!bodyEl || !st) return;
    const isRangeGallery = st.ev?.type === 'range';
    const isGrid = st.viewMode === 'grid';
    const baseFrames = (st.moments[0] && st.moments[0].frames) || [];
    bodyEl.innerHTML = `
      <div class="ux-lb-shell" data-lb-kind="${isRangeGallery ? 'range' : 'moment'}">
        <div class="ux-lb-moments-bar">
          ${isRangeGallery ? `
            <span class="ux-lb-kf-meta ux-num" data-ux-lb-kf-meta>Keyframe 1 of ${st.moments.length}</span>
          ` : `
            <div class="ux-lb-moments-rail ds-scrollbar" role="tablist" aria-label="Moments">
              ${st.moments.map((m, mIdx) => `
                <button type="button" class="ux-lb-moment-tab" role="tab" aria-selected="false" data-ux-lb-moment="${mIdx}">
                  ${m.isPrimary ? '<span class="ux-lb-moment-tab__dot" aria-hidden="true"></span>' : ''}
                  <span class="ux-lb-moment-tab__time ux-num">${esc(m.shortTime)}</span>
                  <span class="ux-lb-moment-tab__label">${esc(m.label)}</span>
                </button>
              `).join('')}
            </div>
          `}
          <div class="ux-lb-bar-actions">
            <div class="ux-lb-step-btns" role="group" aria-label="Navigate keyframes">
              <button type="button" class="ds-button ds-button--secondary ds-button--icon" data-ux-lb-prev-moment aria-label="Previous keyframe">
                ${LB_ARROW_LEFT_SVG}
              </button>
              <span class="ux-lb-step-pos ux-num" data-ux-lb-pos>1/${st.moments.length}</span>
              <button type="button" class="ds-button ds-button--secondary ds-button--icon" data-ux-lb-next-moment aria-label="Next keyframe">
                ${LB_ARROW_RIGHT_SVG}
              </button>
            </div>
            <div class="ux-lb-view-toggle" role="tablist" aria-label="Camera layout">
              <button type="button" class="ds-button ds-button--ghost" role="tab" data-ux-lb-view="single" aria-selected="${!isGrid}" aria-pressed="${!isGrid}" data-active="${!isGrid}">
                ${LB_IMAGE_SVG}
                <span>1 cam</span>
              </button>
              <button type="button" class="ds-button ds-button--ghost" role="tab" data-ux-lb-view="grid" aria-selected="${isGrid}" aria-pressed="${isGrid}" data-active="${isGrid}">
                ${LB_GRID_SVG}
                <span>4 cams</span>
              </button>
            </div>
          </div>
        </div>

        <div class="ux-lb-viewport">
          <div class="ux-lb-single-pane" data-ux-lb-single-pane>
            <div class="ux-lb-stage">
              <img class="ux-lb-stage__img" data-ux-lb-main-img src="" alt="" decoding="async" />
              <button type="button" class="ds-button ds-button--ghost ds-button--icon ux-lb-stage__nav ux-lb-stage__nav--prev" data-ux-lb-stage-prev aria-label="${isRangeGallery ? 'Previous keyframe' : 'Previous camera frame'}">
                ${LB_ARROW_LEFT_SVG}
              </button>
              <button type="button" class="ds-button ds-button--ghost ds-button--icon ux-lb-stage__nav ux-lb-stage__nav--next" data-ux-lb-stage-next aria-label="${isRangeGallery ? 'Next keyframe' : 'Next camera frame'}">
                ${LB_ARROW_RIGHT_SVG}
              </button>
              <div class="ux-lb-stage__hud-top">
                <span class="ux-lb-pill" data-ux-lb-hud-cam></span>
                <span class="ux-lb-pill ux-num" data-ux-lb-hud-time></span>
              </div>
              <div class="ux-lb-stage__hud-bottom">
                <span class="ux-lb-pill" data-ux-lb-hud-desc></span>
              </div>
            </div>

            <div class="ux-lb-cam-group" role="region" aria-label="${isRangeGallery ? 'Keyframes in range' : '4 camera angles'}">
              <div class="ux-lb-cam-strip" role="listbox" aria-label="${isRangeGallery ? 'Keyframes' : 'Camera angles'}">
                ${isRangeGallery ? st.moments.map((m, mIdx) => {
                  const kfFrame = m.frames.find((f) => f.cam === st.activeCam) || m.frames[0];
                  return `
                    <button type="button" class="ux-lb-cam-card" role="option" aria-selected="false" data-active="false" data-ux-lb-kf-idx="${mIdx}">
                      <div class="ux-lb-cam-card__media">
                        <img class="ux-lb-cam-card__img" src="${kfFrame?.imgSrc || ''}" alt="" decoding="async" />
                      </div>
                      <div class="ux-lb-cam-card__foot">
                        <span class="ux-lb-cam-card__name" data-ux-lb-cam-name></span>
                        <span class="ux-lb-cam-card__time ux-num" data-ux-lb-cam-time></span>
                      </div>
                    </button>
                  `;
                }).join('') : baseFrames.map((fr) => `
                  <button type="button" class="ux-lb-cam-card" role="option" aria-selected="false" data-active="false" data-ux-lb-cam="${fr.cam}">
                    <div class="ux-lb-cam-card__media">
                      <img class="ux-lb-cam-card__img" src="${fr.imgSrc}" alt="" decoding="async" />
                    </div>
                    <div class="ux-lb-cam-card__foot">
                      <span class="ux-lb-cam-card__name" data-ux-lb-cam-name></span>
                      <span class="ux-lb-cam-card__time ux-num" data-ux-lb-cam-time></span>
                    </div>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="ux-lb-grid-4" data-ux-lb-grid-pane role="group" aria-label="4 synchronized cameras" hidden>
            ${baseFrames.map((fr) => `
              <button type="button" class="ux-lb-grid-cell" data-ux-lb-grid-cam="${fr.cam}" data-active="false" aria-label="">
                <img class="ux-lb-stage__img" src="${fr.imgSrc}" alt="" decoding="async" />
                <div class="ux-lb-stage__hud-top">
                  <span class="ux-lb-pill" data-ux-lb-grid-camlabel></span>
                </div>
                <div class="ux-lb-stage__hud-bottom">
                  <span class="ux-lb-pill ux-num" data-ux-lb-grid-time></span>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const stepLightboxKeyframe = (dir) => {
      if (!activeLightboxState) return;
      const mLen = activeLightboxState.moments.length;
      if (!mLen) return;
      if (activeLightboxState.ev?.type === 'range') {
        activeLightboxState.momentIdx = ((activeLightboxState.momentIdx + dir) % mLen + mLen) % mLen;
        syncKeyframeModalInPlace();
        return;
      }
      const curMoment = activeLightboxState.moments[activeLightboxState.momentIdx] || activeLightboxState.moments[0];
      if (!curMoment || !curMoment.frames.length) return;
      const camIdx = Math.max(0, curMoment.frames.findIndex((f) => f.cam === activeLightboxState.activeCam));
      const nextCamIdx = camIdx + dir;
      if (nextCamIdx >= 0 && nextCamIdx < curMoment.frames.length) {
        activeLightboxState.activeCam = curMoment.frames[nextCamIdx].cam;
        syncKeyframeModalInPlace();
        return;
      }
      const nextMomentIdx = ((activeLightboxState.momentIdx + dir) % mLen + mLen) % mLen;
      const nextMoment = activeLightboxState.moments[nextMomentIdx];
      const edgeFrame = dir > 0 ? nextMoment.frames[0] : nextMoment.frames[nextMoment.frames.length - 1];
      activeLightboxState.momentIdx = nextMomentIdx;
      if (edgeFrame) activeLightboxState.activeCam = edgeFrame.cam;
      syncKeyframeModalInPlace();
    };

    bodyEl.querySelector('[data-ux-lb-stage-prev]')?.addEventListener('click', () => stepLightboxKeyframe(-1));
    bodyEl.querySelector('[data-ux-lb-stage-next]')?.addEventListener('click', () => stepLightboxKeyframe(1));

    bodyEl.querySelectorAll('[data-ux-lb-kf-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!activeLightboxState) return;
        const mLen = activeLightboxState.moments.length;
        const nextIdx = Math.max(0, Math.min(mLen - 1, Number(btn.dataset.uxLbKfIdx) || 0));
        activeLightboxState.momentIdx = nextIdx;
        syncKeyframeModalInPlace();
      });
    });

    bodyEl.querySelectorAll('[data-ux-lb-moment]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!activeLightboxState) return;
        activeLightboxState.momentIdx = Number(btn.dataset.uxLbMoment) || 0;
        const nextM = activeLightboxState.moments[activeLightboxState.momentIdx];
        if (nextM?.cam && activeLightboxState.ev?.type !== 'range') activeLightboxState.activeCam = nextM.cam;
        syncKeyframeModalInPlace();
      });
    });
    bodyEl.querySelector('[data-ux-lb-prev-moment]')?.addEventListener('click', () => {
      if (activeLightboxState && activeLightboxState.momentIdx > 0) {
        activeLightboxState.momentIdx -= 1;
        const nextM = activeLightboxState.moments[activeLightboxState.momentIdx];
        if (nextM?.cam && activeLightboxState.ev?.type !== 'range') activeLightboxState.activeCam = nextM.cam;
        syncKeyframeModalInPlace();
      }
    });
    bodyEl.querySelector('[data-ux-lb-next-moment]')?.addEventListener('click', () => {
      if (activeLightboxState && activeLightboxState.momentIdx + 1 < activeLightboxState.moments.length) {
        activeLightboxState.momentIdx += 1;
        const nextM = activeLightboxState.moments[activeLightboxState.momentIdx];
        if (nextM?.cam && activeLightboxState.ev?.type !== 'range') activeLightboxState.activeCam = nextM.cam;
        syncKeyframeModalInPlace();
      }
    });
    bodyEl.querySelectorAll('[data-ux-lb-view]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!activeLightboxState) return;
        activeLightboxState.viewMode = btn.dataset.uxLbView === 'grid' ? 'grid' : 'single';
        syncKeyframeModalInPlace();
      });
    });
    bodyEl.querySelectorAll('[data-ux-lb-cam]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!activeLightboxState) return;
        activeLightboxState.activeCam = Number(btn.dataset.uxLbCam) || 1;
        syncKeyframeModalInPlace();
      });
    });
    bodyEl.querySelectorAll('[data-ux-lb-grid-cam]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!activeLightboxState) return;
        const nextCam = Number(btn.dataset.uxLbGridCam) || 1;
        activeLightboxState.activeCam = nextCam;
        activeLightboxState.viewMode = 'single';
        syncKeyframeModalInPlace();
        const targetFocus = bodyEl.querySelector(`.ux-lb-cam-card[data-ux-lb-cam="${nextCam}"]`)
          || bodyEl.querySelector(`.ux-lb-cam-card[data-ux-lb-kf-idx="${activeLightboxState.momentIdx}"]`)
          || bodyEl.querySelector('[data-ux-lb-view="single"]');
        targetFocus?.focus({ preventScroll: true });
      });
    });
  };

  dialogs.frameLightbox?.addEventListener('keydown', (e) => {
    if (!isDialogOpen(dialogs.frameLightbox) || !activeLightboxState) return;
    if (e.target.closest('input, textarea, select, [contenteditable]')) return;

    const camCard = e.target.closest('.ux-lb-cam-card[data-ux-lb-cam], .ux-lb-cam-card[data-ux-lb-kf-idx]');
    if (camCard && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      if (camCard.hasAttribute('data-ux-lb-kf-idx')) {
        const cards = Array.from(dialogs.frameLightbox.querySelectorAll('.ux-lb-cam-card[data-ux-lb-kf-idx]'));
        const curIdx = activeLightboxState.momentIdx;
        let nextIdx = curIdx >= 0 ? curIdx : 0;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIdx = (nextIdx - 1 + cards.length) % cards.length;
        else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIdx = (nextIdx + 1) % cards.length;
        else if (e.key === 'Home') nextIdx = 0;
        else if (e.key === 'End') nextIdx = cards.length - 1;
        const targetCard = cards[nextIdx];
        if (targetCard) {
          activeLightboxState.momentIdx = nextIdx;
          syncKeyframeModalInPlace();
          targetCard.focus({ preventScroll: true });
        }
        return;
      }
      const cards = Array.from(dialogs.frameLightbox.querySelectorAll('.ux-lb-cam-card[data-ux-lb-cam]'));
      const curIdx = cards.findIndex((cEl) => Number(cEl.dataset.uxLbCam) === activeLightboxState.activeCam);
      let nextIdx = curIdx >= 0 ? curIdx : 0;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIdx = (nextIdx - 1 + cards.length) % cards.length;
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIdx = (nextIdx + 1) % cards.length;
      else if (e.key === 'Home') nextIdx = 0;
      else if (e.key === 'End') nextIdx = cards.length - 1;
      const targetCard = cards[nextIdx];
      if (targetCard) {
        activeLightboxState.activeCam = Number(targetCard.dataset.uxLbCam) || 1;
        syncKeyframeModalInPlace();
        targetCard.focus({ preventScroll: true });
      }
      return;
    }

    const momentTab = e.target.closest('[data-ux-lb-moment]');
    if (momentTab && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      const maxIdx = activeLightboxState.moments.length - 1;
      let nextIdx = activeLightboxState.momentIdx;
      if (e.key === 'ArrowLeft') nextIdx = Math.max(0, nextIdx - 1);
      else if (e.key === 'ArrowRight') nextIdx = Math.min(maxIdx, nextIdx + 1);
      else if (e.key === 'Home') nextIdx = 0;
      else if (e.key === 'End') nextIdx = maxIdx;
      if (nextIdx !== activeLightboxState.momentIdx) {
        activeLightboxState.momentIdx = nextIdx;
        syncKeyframeModalInPlace();
      }
      dialogs.frameLightbox.querySelector(`[data-ux-lb-moment="${nextIdx}"]`)?.focus({ preventScroll: true });
      return;
    }

    const inChromeControls = Boolean(e.target.closest('.ux-dialog__header, .ux-dialog__footer, .ux-lb-view-toggle'));
    if (!inChromeControls && e.key === 'ArrowLeft') {
      if (activeLightboxState.momentIdx > 0) {
        e.preventDefault();
        activeLightboxState.momentIdx -= 1;
        syncKeyframeModalInPlace();
      }
    } else if (!inChromeControls && e.key === 'ArrowRight') {
      if (activeLightboxState.momentIdx + 1 < activeLightboxState.moments.length) {
        e.preventDefault();
        activeLightboxState.momentIdx += 1;
        syncKeyframeModalInPlace();
      }
    } else if (e.key >= '1' && e.key <= '4') {
      e.preventDefault();
      activeLightboxState.activeCam = Number(e.key);
      syncKeyframeModalInPlace();
    } else if (e.key === 'g' || e.key === 'G') {
      e.preventDefault();
      activeLightboxState.viewMode = activeLightboxState.viewMode === 'grid' ? 'single' : 'grid';
      syncKeyframeModalInPlace();
    }
  });

  const openKeyframeEvidenceModal = (c, chart, ev, { momentIdx = null, cam = null, viewMode = 'single' } = {}) => {
    const dlg = dialogs.frameLightbox;
    if (!dlg || !c || !chart || !ev) return;
    if (store.activeTimelineRange) clearTimelineRangeFocus(c, false);
    const { moments, primaryMomentIdx, primaryCam, totalCount } = buildEvidenceKeyframeMoments(c, ev);
    const clampedMoment = typeof momentIdx === 'number' && !Number.isNaN(momentIdx)
      ? Math.max(0, Math.min(moments.length - 1, momentIdx))
      : primaryMomentIdx;
    const activeCam = typeof cam === 'number' && cam >= 1 && cam <= 4 ? cam : primaryCam;

    activeLightboxState = {
      c,
      chart,
      ev,
      evKey: getEvidenceTagKey(chart, ev),
      moments,
      totalCount,
      momentIdx: clampedMoment,
      activeCam,
      viewMode: viewMode === 'grid' ? 'grid' : 'single',
    };
    mountKeyframeModalSkeleton(dlg.querySelector('[data-ux-lightbox-body]'), activeLightboxState);
    syncKeyframeModalInPlace();
    if (!isDialogOpen(dlg)) openDialogSmooth(dlg);
  };

  const syncScrubberVisuals = (c, sec) => {
    const activeRange = store.activeTimelineRange;
    if (activeRange) {
      const kfs = activeRange.keyframes || [];
      let closestKf = null;
      let bestKfDist = Infinity;
      kfs.forEach((kf) => {
        const d = Math.abs(kf.cam1Sec - sec);
        if (d < bestKfDist) {
          bestKfDist = d;
          closestKf = kf;
        }
      });
      const inWindow = sec >= activeRange.startSec - 0.25 && sec <= activeRange.endSec + 0.25;
      if (bestKfDist <= 0.3 && closestKf) {
        renderStageOverlay(closestKf);
      } else if (inWindow) {
        renderStageOverlay(activeRange);
      } else {
        renderStageOverlay(null);
      }
      return;
    }

    if (isRawVideoState(c)) {
      if (store.activeConditionTarget) {
        store.activeConditionTarget = null;
        renderStageOverlay(null);
      }
      return;
    }

    const condTarget = store.activeConditionTarget;
    if (condTarget && Math.abs(condTarget.sec - sec) <= 0.25) {
      renderStageOverlay(condTarget);
      return;
    }

    if (condTarget) {
      store.activeConditionTarget = null;
      renderStageOverlay(null);
      document.querySelectorAll('[data-ux-cond-key][data-active="true"]').forEach((el) => {
        el.dataset.active = 'false';
      });
      if (!store.activeTimelineRange && store.activeStep2EvidenceTag) {
        store.activeStep2EvidenceTag = null;
      }
      syncLinkedEvidenceHighlight();
    }
  };

  let lastCam1RefSec = 12.4;

  const syncCaseClosedControls = (c) => {
    const isClosed = Boolean(c?.isClosed);
    document.querySelectorAll('[data-action="manage-videos"]').forEach((btn) => {
      btn.disabled = isClosed;
    });
  };

  const syncMissingCameraStates = (c) => {
    (c?.videos || []).forEach((v) => {
      const missing = String(!v.present);
      const headEl = document.querySelector(`[data-nle-cam="${v.slot}"]`);
      if (headEl) headEl.dataset.missing = missing;
      const laneEl = document.querySelector(`[data-nle-lane="${v.slot}"]`);
      if (laneEl) laneEl.dataset.missing = missing;
      const cellEl = videoCanvasEl?.querySelector(`[data-video-grid-cell="${v.slot}"]`);
      if (cellEl) cellEl.dataset.missing = missing;
      const durEl = document.querySelector(`[data-video-card-dur="${v.slot}"]`);
      if (durEl) {
        durEl.textContent = v.present ? `${Number(v.durationSec || 24).toFixed(1)}s` : 'No clip';
      }
      const clipEl = document.querySelector(`[data-nle-clip="${v.slot}"]`);
      if (clipEl) {
        if (v.present) {
          const durSec = Math.max(0.5, Math.min(30, Number(v.durationSec || 24)));
          const startSec = Number.isFinite(v.masterStartSec)
            ? Math.max(0, Math.min(30 - durSec, v.masterStartSec))
            : Math.max(0, 15.0 - durSec / 2);
          clipEl.hidden = false;
          clipEl.style.setProperty('--clip-start', `${((startSec / 30) * 100).toFixed(3)}%`);
          clipEl.style.setProperty('--clip-span', `${((durSec / 30) * 100).toFixed(3)}%`);
        } else {
          clipEl.hidden = true;
        }
      }
    });
  };

  const renderVideoTimeline = (c) => {
    const isRaw = isRawVideoState(c);
    const hasImpact = Boolean(c?.analysisDone && !runningStepState[1] && c.stage !== 'undetermined');

    if (videoJumpImpactBtn) videoJumpImpactBtn.hidden = !hasImpact;
    if (gridTimelineEl) {
      gridTimelineEl.dataset.hasImpact = String(hasImpact);
      if (hasImpact) delete gridTimelineEl.dataset.raw;
      else gridTimelineEl.dataset.raw = 'true';
      const nleImpactBtn = gridTimelineEl.querySelector('[data-nle-impact-node]');
      if (nleImpactBtn) nleImpactBtn.hidden = !hasImpact;
      document.dispatchEvent(new CustomEvent('ux-timeline-meta-sync'));
    }

    syncMissingCameraStates(c);

    if (isRaw) {
      renderStageOverlay(null);
    }

    syncScrubberVisuals(c, lastCam1RefSec);
  };

  document.addEventListener('ux-range-clear', () => {
    const c = getCase();
    store.activeConditionTarget = null;
    renderStageOverlay(null);
    clearTimelineRangeFocus(c, store.activeNav === 'case-detail');
  });

  document.addEventListener('ux-range-kf-select', (e) => {
    const kfId = e.detail?.kfId;
    const kf = store.activeTimelineRange?.keyframes?.find((x) => x.id === kfId);
    if (kf) jumpToRangeKeyframe(getCase(), kf);
  });

  document.addEventListener('ux-scrubber-change', (e) => {
    lastCam1RefSec = e.detail?.seconds ?? 12.4;
    if (store.activeNav === 'case-detail') {
      syncScrubberVisuals(getCase(), lastCam1RefSec);
    }
  });

  document.addEventListener('ux-camera-change', () => {
    if (store.activeNav === 'case-detail') {
      renderVideoTimeline(getCase());
    }
  });

  // ── 4-Step Workbench Stepper & Banners ──
  const STEPPER_CHECK_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 14L8.5 17.5L19 6.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/></svg>';

  const stepperEl = document.querySelector('[data-ux-stepper]');
  const stepperRailEl = stepperEl?.querySelector('[data-ux-stepper-rail]');
  let lastStepperCaseId = null;
  const bannersEl = document.querySelector('[data-ux-banners]');
  const stepPanels = {
    1: document.querySelector('[data-ux-step-panel="1"]'),
    2: document.querySelector('[data-ux-step-panel="2"]'),
    3: document.querySelector('[data-ux-step-panel="3"]'),
    4: document.querySelector('[data-ux-step-panel="4"]'),
  };

  const ensureStepMarkerLayers = (markerEl, s) => {
    if (!markerEl || markerEl.querySelector('.ux-step-num')) return;
    const numLabel = esc(markerEl.dataset.stepNum || String(s));
    markerEl.innerHTML = `<span class="ux-step-icon ux-step-icon--base ux-step-num">${numLabel}</span><span class="ux-step-icon ux-step-icon--check">${STEPPER_CHECK_SVG}</span>`;
  };

  const getFurthestStep = (c) => {
    if (!c) return 1;
    if (store.furthestStepByCase[c.id] != null) return store.furthestStepByCase[c.id];
    if (c.isClosed) return 4;
    if (c.stage === 'agreed' || (c.versions && c.versions.length > 0)) return 3;
    return Math.max(1, store.activeStep || 1);
  };

  const syncStepperUI = (c) => {
    const isCaseSwitch = Boolean(c?.id && c.id !== lastStepperCaseId);
    if (isCaseSwitch && stepperRailEl) stepperRailEl.dataset.instant = 'true';
    if (stepperRailEl) stepperRailEl.dataset.activeStep = String(store.activeStep || 1);

    const lockedAfterReport = c.versions.length === 0 && !c.isClosed;
    const furthestStep = getFurthestStep(c);
    stepperEl?.querySelectorAll('[data-ux-step]').forEach((stepEl) => {
      const s = Number(stepEl.dataset.uxStep);
      const selected = s === store.activeStep;
      const isLocked = (s === 3 || s === 4) && lockedAfterReport;
      if (isLocked) {
        stepEl.dataset.locked = 'true';
        stepEl.setAttribute('aria-disabled', 'true');
      } else {
        delete stepEl.dataset.locked;
        stepEl.removeAttribute('aria-disabled');
      }

      let isDone = false;
      if (s === 1 && (c.analysisDone || furthestStep >= 2 || store.activeStep >= 2) && Boolean(c.selectedChart) && c.stage !== 'undetermined') isDone = true;
      else if (s === 2 && c.versions.length > 0) isDone = true;
      else if (s === 3 && (c.stage === 'agreed' || c.stage === 'closed')) isDone = true;
      else if (s === 4 && c.isClosed) isDone = true;

      if (isDone) stepEl.dataset.done = 'true';
      else delete stepEl.dataset.done;

      if (selected) {
        stepEl.dataset.state = 'current';
        stepEl.setAttribute('aria-current', 'step');
      } else if (isDone) {
        stepEl.dataset.state = 'completed';
        stepEl.removeAttribute('aria-current');
      } else {
        stepEl.dataset.state = 'upcoming';
        stepEl.removeAttribute('aria-current');
      }

      const titleText = stepEl.querySelector('.ds-progress-step__title')?.textContent?.trim() || '';
      if (titleText) stepEl.setAttribute('aria-label', `Step ${s}: ${titleText}`);

      const showCheck = stepEl.dataset.state === 'completed' || (isDone && c.isClosed && selected);
      stepEl.dataset.showCheck = String(showCheck);

      const markerEl = stepEl.querySelector('.ds-progress-step__marker');
      if (markerEl) {
        ensureStepMarkerLayers(markerEl, s);
        markerEl.setAttribute('aria-hidden', 'true');
      }
    });

    if (isCaseSwitch) {
      lastStepperCaseId = c.id;
      if (stepperRailEl) {
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (stepperRailEl) delete stepperRailEl.dataset.instant;
        }));
      }
    }
  };

  const renderBanners = (c) => {
    if (!bannersEl) return;

    const parts = [];
    if (c.isClosed && store.activeStep !== 4) {
      parts.push(`
        <div class="ds-callout ds-callout--warning ux-callout" role="status">
          <span class="ds-callout__icon" aria-hidden="true">${ICON_ALERT_TRIANGLE}</span>
          <div class="ds-callout__content">
            <span class="ds-callout__title">Closed (${esc(c.closeReason || 'Mutual settlement')}) · Read-only</span>
          </div>
          <button type="button" class="ds-button ds-button--secondary" data-ux-reopen-case>Reopen case</button>
        </div>
      `);
    }
    if (c.stage === 'undetermined' && store.activeStep !== 1) {
      parts.push(`
        <div class="ds-callout ds-callout--danger ux-callout" role="alert">
          <span class="ds-callout__icon" aria-hidden="true">${ICON_ALERT_CIRCLE}</span>
          <div class="ds-callout__content">
            <span class="ds-callout__title">Paused · ${esc(c.haltStage || 'Unclear lane marking')}</span>
          </div>
          <button type="button" class="ds-button ds-button--secondary" data-ux-go-step1>Resume in Step 1</button>
        </div>
      `);
    }
    bannersEl.innerHTML = parts.join('');
    bannersEl.querySelector('[data-ux-reopen-case]')?.addEventListener('click', () => reopenCase(c));
    bannersEl.querySelector('[data-ux-go-step1]')?.addEventListener('click', () => selectStep(1));
  };

  // ── 4-Tier Visual Flow & Floating Action Bar Dock ──
  const floatBarDockEl = document.querySelector('[data-ux-float-bar-dock]');
  const runningStepState = { 1: false, 2: false, 3: false };

  // ── Step 1: Analysis & Accident Scenario Match (Auto-Collapse Reasoning -> Expandable KNIA Scenario Detail) ──
  const step1WrapEl = document.querySelector('[data-ux-analysing-wrap]');
  const step1ChartsEl = document.querySelector('[data-ux-step1-charts]');
  const analysingEl = document.querySelector('[data-case-analysing]');

  // ── Step 2: AI Supporting Evidence Reasoning & Frame/Range Citations ──
  const step2WrapEl = document.querySelector('[data-ux-step2-analysing-wrap]');
  const step2AnalysingEl = document.querySelector('[data-step2-analysing]');
  const step2BodyEl = document.querySelector('[data-ux-step2-body]');

  // ── Step 3: AI Modifier Reasoning & Fault Adjustment Evaluation ──
  const step3WrapEl = document.querySelector('[data-ux-step3-analysing-wrap]');
  const step3AnalysingEl = document.querySelector('[data-step3-analysing]');
  const step3BodyEl = document.querySelector('[data-ux-step3-body]');

  const KNIA_SIM_PLAY_MS = 3500;
  const KNIA_SIM_IMPACT_T = 0.78;
  const KNIA_SIM_SETTLE_T = 0.86;
  const KNIA_SIM_CHEV_STEP = 34;
  const KNIA_SIM_SLOT_COUNT = 6;
  const kniaSimStates = new WeakMap();

  const createSimPathLut = (segs) => {
    const lut = [];
    let total = 0;
    const push = (x, y, deg) => {
      const prev = lut[lut.length - 1];
      if (prev) total += Math.hypot(x - prev.x, y - prev.y);
      lut.push({ x, y, deg, dist: total });
    };
    segs.forEach((seg) => {
      const kind = seg[0];
      if (kind === 'line') {
        const [, x0, y0, x1, y1, n = 12] = seg;
        const deg = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
        for (let i = (lut.length ? 1 : 0); i <= n; i += 1) {
          const f = i / n;
          push(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, deg);
        }
      } else if (kind === 'quad') {
        const [, x0, y0, cx, cy, x1, y1, n = 40] = seg;
        for (let i = (lut.length ? 1 : 0); i <= n; i += 1) {
          const t = i / n;
          const o = 1 - t;
          const x = o * o * x0 + 2 * o * t * cx + t * t * x1;
          const y = o * o * y0 + 2 * o * t * cy + t * t * y1;
          const dx = 2 * o * (cx - x0) + 2 * t * (x1 - cx);
          const dy = 2 * o * (cy - y0) + 2 * t * (y1 - cy);
          push(x, y, (Math.atan2(dy, dx) * 180) / Math.PI);
        }
      } else if (kind === 'cubic') {
        const [, x0, y0, x1, y1, x2, y2, x3, y3, n = 44] = seg;
        for (let i = (lut.length ? 1 : 0); i <= n; i += 1) {
          const t = i / n;
          const o = 1 - t;
          const x = o * o * o * x0 + 3 * o * o * t * x1 + 3 * o * t * t * x2 + t * t * t * x3;
          const y = o * o * o * y0 + 3 * o * o * t * y1 + 3 * o * t * t * y2 + t * t * t * y3;
          const dx = 3 * o * o * (x1 - x0) + 6 * o * t * (x2 - x1) + 3 * t * t * (x3 - x2);
          const dy = 3 * o * o * (y1 - y0) + 6 * o * t * (y2 - y1) + 3 * t * t * (y3 - y2);
          push(x, y, (Math.atan2(dy, dx) * 180) / Math.PI);
        }
      } else if (kind === 'arc') {
        const [, cx, cy, r, d0, d1, n = 48] = seg;
        const sign = d1 >= d0 ? 1 : -1;
        for (let i = (lut.length ? 1 : 0); i <= n; i += 1) {
          const a = ((d0 + (d1 - d0) * (i / n)) * Math.PI) / 180;
          push(cx + r * Math.cos(a), cy + r * Math.sin(a), (Math.atan2(sign * Math.cos(a), -sign * Math.sin(a)) * 180) / Math.PI);
        }
      }
    });
    lut.total = total;
    return lut;
  };

  const sampleSimLut = (lut, targetDist) => {
    const d = Math.max(0, Math.min(lut.total, targetDist));
    let lo = 0;
    let hi = lut.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (lut[mid].dist <= d) lo = mid;
      else hi = mid;
    }
    const a = lut[lo];
    const b = lut[hi];
    const f = (d - a.dist) / Math.max(1e-5, b.dist - a.dist);
    let dDeg = b.deg - a.deg;
    if (dDeg > 180) dDeg -= 360;
    if (dDeg < -180) dDeg += 360;
    return {
      x: a.x + (b.x - a.x) * f,
      y: a.y + (b.y - a.y) * f,
      deg: a.deg + dDeg * f,
      dist: d,
    };
  };

  const buildRibbonPolyOnLut = (lut, dStart, dEnd, halfW = 10) => {
    const endDist = Math.min(lut.total, dEnd);
    const startDist = Math.max(0, Math.min(endDist - 1, dStart));
    if (endDist - startDist <= 2) return '';
    const steps = 16;
    const leftPts = [];
    const rightPts = [];
    for (let i = 0; i <= steps; i += 1) {
      const pt = sampleSimLut(lut, startDist + ((endDist - startDist) * i) / steps);
      const rad = (pt.deg * Math.PI) / 180;
      const nx = -Math.sin(rad);
      const ny = Math.cos(rad);
      leftPts.push([+(pt.x + nx * halfW).toFixed(1), +(pt.y + ny * halfW).toFixed(1)]);
      rightPts.push([+(pt.x - nx * halfW).toFixed(1), +(pt.y - ny * halfW).toFixed(1)]);
    }
    return `M ${leftPts.map((p) => `${p[0]} ${p[1]}`).join(' L ')} L ${[...rightPts].reverse().map((p) => `${p[0]} ${p[1]}`).join(' L ')} Z`;
  };

  const simSmoothStep = (e0, e1, x) => {
    const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };

  const simApproachCurve = (u) => (u - 0.14 * u * u * u) / 0.86;

  const ensureKniaSimDefs = () => {
    if (document.getElementById('ux-knia-sim-defs')) return;
    const cwBars = (xStart, yStart, horizontal) => {
      const offsets = [0, 9, 18, 40, 49, 58];
      return offsets.map((off) => (
        horizontal
          ? `<rect x="${xStart}" y="${yStart + off}" width="10" height="4" rx="1" />`
          : `<rect x="${xStart + off}" y="${yStart}" width="4" height="10" rx="1" />`
      )).join('');
    };
    const host = document.createElement('div');
    host.innerHTML = `
      <svg id="ux-knia-sim-defs" class="ux-as-sim-defs" aria-hidden="true">
        <defs>
          <filter id="ux-knia-car-shadow" x="-35%" y="-55%" width="170%" height="210%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.0" flood-color="var(--ux-sim-shadow)" flood-opacity="0.46" />
          </filter>

          <radialGradient id="ux-knia-asphalt-grad" cx="50%" cy="50%" r="62%">
            <stop offset="0%" stop-color="var(--ux-sim-road-core)" />
            <stop offset="56%" stop-color="var(--ux-sim-road-mid)" />
            <stop offset="100%" stop-color="var(--ux-sim-road-outer)" />
          </radialGradient>

          <linearGradient id="ux-knia-sig-housing" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--ux-sim-sig-top)" />
            <stop offset="100%" stop-color="var(--ux-sim-sig-bot)" />
          </linearGradient>
          <linearGradient id="ux-knia-turn-sign" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--ux-sim-info)" />
            <stop offset="100%" stop-color="var(--ux-sim-info-deep)" />
          </linearGradient>

          <radialGradient id="ux-knia-glow-green">
            <stop offset="0%" stop-color="var(--ux-sim-sig-green)" stop-opacity="0.95" />
            <stop offset="45%" stop-color="var(--ux-sim-sig-green)" stop-opacity="0.40" />
            <stop offset="100%" stop-color="var(--ux-sim-sig-green)" stop-opacity="0" />
          </radialGradient>
          <radialGradient id="ux-knia-glow-red">
            <stop offset="0%" stop-color="var(--ux-sim-sig-red)" stop-opacity="0.95" />
            <stop offset="45%" stop-color="var(--ux-sim-sig-red)" stop-opacity="0.42" />
            <stop offset="100%" stop-color="var(--ux-sim-sig-red)" stop-opacity="0" />
          </radialGradient>
          <radialGradient id="ux-knia-impact-wave">
            <stop offset="0%" stop-color="var(--ux-sim-impact)" stop-opacity="0" />
            <stop offset="68%" stop-color="var(--ux-sim-impact)" stop-opacity="0.06" />
            <stop offset="88%" stop-color="var(--ux-sim-impact)" stop-opacity="0.54" />
            <stop offset="100%" stop-color="var(--ux-sim-impact)" stop-opacity="0" />
          </radialGradient>
          <radialGradient id="ux-knia-impact-core">
            <stop offset="0%" stop-color="var(--ux-sim-badge-text)" stop-opacity="0.98" />
            <stop offset="32%" stop-color="var(--ux-sim-impact)" stop-opacity="0.90" />
            <stop offset="66%" stop-color="var(--ux-sim-impact-core)" stop-opacity="0.32" />
            <stop offset="100%" stop-color="var(--ux-sim-impact-core)" stop-opacity="0" />
          </radialGradient>
          <linearGradient id="ux-knia-red-corridor" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--ux-sim-sig-red)" stop-opacity="0.0" />
            <stop offset="100%" stop-color="var(--ux-sim-sig-red)" stop-opacity="0.16" />
          </linearGradient>

          <linearGradient id="ux-knia-pearl-a" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--ux-sim-car-a-0)" />
            <stop offset="28%" stop-color="var(--ux-sim-car-a-1)" />
            <stop offset="78%" stop-color="var(--ux-sim-car-a-2)" />
            <stop offset="100%" stop-color="var(--ux-sim-car-a-3)" />
          </linearGradient>
          <linearGradient id="ux-knia-silver-b" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--ux-sim-car-b-0)" />
            <stop offset="30%" stop-color="var(--ux-sim-car-b-1)" />
            <stop offset="78%" stop-color="var(--ux-sim-car-b-2)" />
            <stop offset="100%" stop-color="var(--ux-sim-car-b-3)" />
          </linearGradient>
          <linearGradient id="ux-knia-hood-sheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--ux-sim-sheen)" stop-opacity="0.0" />
            <stop offset="60%" stop-color="var(--ux-sim-sheen)" stop-opacity="0.22" />
            <stop offset="100%" stop-color="var(--ux-sim-sheen)" stop-opacity="0.0" />
          </linearGradient>
          <linearGradient id="ux-knia-glass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--ux-sim-glass-0)" />
            <stop offset="55%" stop-color="var(--ux-sim-glass-1)" />
            <stop offset="100%" stop-color="var(--ux-sim-glass-2)" />
          </linearGradient>
          <linearGradient id="ux-knia-sunroof" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--ux-sim-sheen)" stop-opacity="0.14" />
            <stop offset="48%" stop-color="var(--ux-sim-glass-1)" stop-opacity="0.96" />
            <stop offset="100%" stop-color="var(--ux-sim-glass-2)" stop-opacity="0.98" />
          </linearGradient>

          <linearGradient id="ux-knia-chevron-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--ux-sim-chevron)" stop-opacity="0.0" />
            <stop offset="58%" stop-color="var(--ux-sim-chevron)" stop-opacity="0.34" />
            <stop offset="100%" stop-color="var(--ux-sim-chevron)" stop-opacity="0.72" />
          </linearGradient>
          <path id="ux-knia-chevron" d="M -3.4 -4.8 L 3.8 0 L -3.4 4.8 L -1.1 0 Z" fill="url(#ux-knia-chevron-grad)" />

          <radialGradient id="ux-knia-stage-mask-grad" cx="50%" cy="50%" r="64%">
            <stop offset="0%" stop-color="var(--ux-sim-mask-white)" stop-opacity="1" />
            <stop offset="74%" stop-color="var(--ux-sim-mask-white)" stop-opacity="0.98" />
            <stop offset="92%" stop-color="var(--ux-sim-mask-white)" stop-opacity="0.66" />
            <stop offset="100%" stop-color="var(--ux-sim-mask-white)" stop-opacity="0.24" />
          </radialGradient>
          <mask id="ux-knia-road-mask">
            <rect x="0" y="0" width="320" height="180" fill="url(#ux-knia-stage-mask-grad)" />
          </mask>

          <!-- Directional subtle party ribbon fills (A Purple, B Yellow) -->
          <linearGradient id="ux-knia-a-e" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--ux-sim-party-a)" stop-opacity="0.24" />
            <stop offset="55%" stop-color="var(--ux-sim-party-a)" stop-opacity="0.10" />
            <stop offset="100%" stop-color="var(--ux-sim-party-a)" stop-opacity="0.0" />
          </linearGradient>
          <linearGradient id="ux-knia-a-n" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="var(--ux-sim-party-a)" stop-opacity="0.24" />
            <stop offset="55%" stop-color="var(--ux-sim-party-a)" stop-opacity="0.10" />
            <stop offset="100%" stop-color="var(--ux-sim-party-a)" stop-opacity="0.0" />
          </linearGradient>
          <linearGradient id="ux-knia-a-se" gradientUnits="userSpaceOnUse" x1="70" y1="108" x2="142" y2="174">
            <stop offset="0%" stop-color="var(--ux-sim-party-a)" stop-opacity="0.24" />
            <stop offset="58%" stop-color="var(--ux-sim-party-a)" stop-opacity="0.10" />
            <stop offset="100%" stop-color="var(--ux-sim-party-a)" stop-opacity="0.0" />
          </linearGradient>
          <linearGradient id="ux-knia-a-ccw" gradientUnits="userSpaceOnUse" x1="122" y1="158" x2="190" y2="54">
            <stop offset="0%" stop-color="var(--ux-sim-party-a)" stop-opacity="0.24" />
            <stop offset="58%" stop-color="var(--ux-sim-party-a)" stop-opacity="0.10" />
            <stop offset="100%" stop-color="var(--ux-sim-party-a)" stop-opacity="0.0" />
          </linearGradient>

          <linearGradient id="ux-knia-b-s" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--ux-sim-party-b)" stop-opacity="0.26" />
            <stop offset="58%" stop-color="var(--ux-sim-party-b)" stop-opacity="0.11" />
            <stop offset="100%" stop-color="var(--ux-sim-party-b)" stop-opacity="0.0" />
          </linearGradient>
          <linearGradient id="ux-knia-b-e" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--ux-sim-party-b)" stop-opacity="0.26" />
            <stop offset="58%" stop-color="var(--ux-sim-party-b)" stop-opacity="0.11" />
            <stop offset="100%" stop-color="var(--ux-sim-party-b)" stop-opacity="0.0" />
          </linearGradient>
          <linearGradient id="ux-knia-b-curve" x1="85%" y1="12%" x2="20%" y2="92%">
            <stop offset="0%" stop-color="var(--ux-sim-party-b)" stop-opacity="0.26" />
            <stop offset="58%" stop-color="var(--ux-sim-party-b)" stop-opacity="0.11" />
            <stop offset="100%" stop-color="var(--ux-sim-party-b)" stop-opacity="0.0" />
          </linearGradient>
          <linearGradient id="ux-knia-b-nw" x1="100%" y1="65%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="var(--ux-sim-party-b)" stop-opacity="0.26" />
            <stop offset="58%" stop-color="var(--ux-sim-party-b)" stop-opacity="0.11" />
            <stop offset="100%" stop-color="var(--ux-sim-party-b)" stop-opacity="0.0" />
          </linearGradient>
          <linearGradient id="ux-knia-b-uturn" gradientUnits="userSpaceOnUse" x1="220" y1="76" x2="140" y2="148">
            <stop offset="0%" stop-color="var(--ux-sim-party-b)" stop-opacity="0.26" />
            <stop offset="60%" stop-color="var(--ux-sim-party-b)" stop-opacity="0.11" />
            <stop offset="100%" stop-color="var(--ux-sim-party-b)" stop-opacity="0.0" />
          </linearGradient>

          <!-- Sculpted 44x19 sedan hull (borderless fills) -->
          <g id="ux-knia-sedan-hull">
            <path d="M 5.2 -9.0 C 5.8 -11.6 3.5 -11.9 3.2 -9.3 Z" fill="currentColor" />
            <path d="M 5.2 9.0 C 5.8 11.6 3.5 11.9 3.2 9.3 Z" fill="currentColor" />
            <path d="M -21.5 -7.0 C -21.3 -8.8 -16.4 -9.5 -7.5 -9.5 L 7.8 -9.5 C 16.5 -9.5 21.1 -7.9 21.7 -3.6 C 22 -1.2 22 1.2 21.7 3.6 C 21.1 7.9 16.5 9.5 7.8 9.5 L -7.5 9.5 C -16.4 9.5 -21.3 8.8 -21.5 7.0 C -22 2.4 -22 -2.4 -21.5 -7.0 Z" />
          </g>

          <g id="ux-knia-car-a-body" filter="url(#ux-knia-car-shadow)">
            <g color="var(--ux-sim-car-a-2)" fill="url(#ux-knia-pearl-a)">
              <use href="#ux-knia-sedan-hull" />
            </g>
            <path d="M 9.2 -5.8 Q 16 -5.0 20.4 -2.8 L 20.4 2.8 Q 16 5.0 9.2 5.8 Z" fill="url(#ux-knia-hood-sheen)" />
            <path d="M -17.0 -5.4 C -11.5 -6.4 1.5 -6.4 8.8 -5.5 C 10.1 -2.4 10.1 2.4 8.8 5.5 C 1.5 6.4 -11.5 6.4 -17.0 5.4 C -17.8 2.0 -17.8 -2.0 -17.0 -5.4 Z" fill="url(#ux-knia-glass)" />
            <rect x="-10.2" y="-5.3" width="11.8" height="10.6" rx="2.2" fill="url(#ux-knia-pearl-a)" />
            <rect x="-9.0" y="-4.1" width="9.2" height="8.2" rx="1.6" fill="url(#ux-knia-sunroof)" />
            <rect x="19.2" y="-6.6" width="2.5" height="1.2" rx="0.6" transform="rotate(36 20.4 -6.0)" fill="var(--ux-sim-badge-text)" opacity="0.85" />
            <rect x="19.2" y="5.4" width="2.5" height="1.2" rx="0.6" transform="rotate(-36 20.4 6.0)" fill="var(--ux-sim-badge-text)" opacity="0.85" />
          </g>

          <g id="ux-knia-car-b-body" filter="url(#ux-knia-car-shadow)">
            <g color="var(--ux-sim-car-b-2)" fill="url(#ux-knia-silver-b)">
              <use href="#ux-knia-sedan-hull" />
            </g>
            <path d="M 9.2 -5.8 Q 16 -5.0 20.4 -2.8 L 20.4 2.8 Q 16 5.0 9.2 5.8 Z" fill="url(#ux-knia-hood-sheen)" opacity="0.65" />
            <path d="M -17.0 -5.4 C -11.5 -6.4 1.5 -6.4 8.8 -5.5 C 10.1 -2.4 10.1 2.4 8.8 5.5 C 1.5 6.4 -11.5 6.4 -17.0 5.4 C -17.8 2.0 -17.8 -2.0 -17.0 -5.4 Z" fill="url(#ux-knia-glass)" />
            <rect x="-10.2" y="-5.3" width="11.8" height="10.6" rx="2.2" fill="url(#ux-knia-silver-b)" />
            <rect x="-9.0" y="-4.1" width="9.2" height="8.2" rx="1.6" fill="url(#ux-knia-sunroof)" />
            <rect x="19.2" y="-6.6" width="2.5" height="1.2" rx="0.6" transform="rotate(36 20.4 -6.0)" fill="var(--ux-sim-badge-text)" opacity="0.75" />
            <rect x="19.2" y="5.4" width="2.5" height="1.2" rx="0.6" transform="rotate(-36 20.4 6.0)" fill="var(--ux-sim-badge-text)" opacity="0.75" />
            <rect x="-21.4" y="-5.6" width="1.2" height="11.2" rx="0.6" fill="var(--ux-sim-sig-red)" opacity="0.68" />
          </g>

          <!-- Minimalist Pedestrian Actor (for KNIA-102 crosswalk) -->
          <g id="ux-knia-ped-b" filter="url(#ux-knia-car-shadow)">
            <rect x="-5.5" y="-9.5" width="11" height="19" rx="5.5" fill="url(#ux-knia-silver-b)" />
          </g>

          <!-- Reusable 3-lamp Korean Signal Heads -->
          <g id="ux-knia-sig-green">
            <rect x="-15" y="-5.5" width="30" height="11" rx="5.5" fill="url(#ux-knia-sig-housing)" />
            <circle cx="-8.5" cy="0" r="2.6" fill="var(--ux-sim-lamp-off)" />
            <circle cx="0" cy="0" r="2.6" fill="var(--ux-sim-lamp-off)" />
            <circle cx="8.5" cy="0" r="6.5" fill="url(#ux-knia-glow-green)" />
            <circle cx="8.5" cy="0" r="2.8" fill="var(--ux-sim-sig-green)" />
          </g>
          <g id="ux-knia-sig-red">
            <rect x="-15" y="-5.5" width="30" height="11" rx="5.5" fill="url(#ux-knia-sig-housing)" />
            <circle cx="-8.5" cy="0" r="6.5" fill="url(#ux-knia-glow-red)" />
            <circle cx="-8.5" cy="0" r="2.8" fill="var(--ux-sim-sig-red)" />
            <circle cx="0" cy="0" r="2.6" fill="var(--ux-sim-lamp-off)" />
            <circle cx="8.5" cy="0" r="2.6" fill="var(--ux-sim-lamp-off)" />
          </g>

          <!-- Standard 4-way Korean Intersection Grid (320x180) -->
          <g id="ux-knia-cross-grid" mask="url(#ux-knia-road-mask)">
            <path d="M 124 0 H 196 V 54 H 320 V 126 H 196 V 180 H 124 V 126 H 0 V 54 H 124 Z" fill="url(#ux-knia-asphalt-grad)" />
            <g fill="var(--ux-sim-centerline)" fill-opacity="0.58">
              <rect x="0" y="88.1" width="104" height="1.1" rx="0.55" />
              <rect x="0" y="90.8" width="104" height="1.1" rx="0.55" />
              <rect x="216" y="88.1" width="104" height="1.1" rx="0.55" />
              <rect x="216" y="90.8" width="104" height="1.1" rx="0.55" />
              <rect x="158.1" y="0" width="1.1" height="34" rx="0.55" />
              <rect x="160.8" y="0" width="1.1" height="34" rx="0.55" />
              <rect x="158.1" y="146" width="1.1" height="34" rx="0.55" />
              <rect x="160.8" y="146" width="1.1" height="34" rx="0.55" />
            </g>
            <g fill="var(--ux-sim-marking)">
              ${cwBars(110, 59, true)}
              ${cwBars(200, 59, true)}
              ${cwBars(129, 40, false)}
              ${cwBars(129, 130, false)}
            </g>
            <rect x="104" y="92" width="2" height="32" rx="1" fill="var(--ux-sim-stopbar)" />
          </g>

          <!-- Highway 2-Lane Corridor Grid (320x180: lane_cutin, rear_end) -->
          <g id="ux-knia-highway-grid" mask="url(#ux-knia-road-mask)">
            <rect x="0" y="24" width="320" height="132" fill="url(#ux-knia-asphalt-grad)" />
            <g fill="var(--ux-sim-marking)">
              <rect x="8" y="89" width="18" height="2" rx="1" />
              <rect x="40" y="89" width="18" height="2" rx="1" />
              <rect x="72" y="89" width="18" height="2" rx="1" />
              <rect x="104" y="89" width="18" height="2" rx="1" />
              <rect x="136" y="89" width="18" height="2" rx="1" />
              <rect x="168" y="89" width="18" height="2" rx="1" />
              <rect x="200" y="89" width="18" height="2" rx="1" />
              <rect x="232" y="89" width="18" height="2" rx="1" />
              <rect x="264" y="89" width="18" height="2" rx="1" />
              <rect x="296" y="89" width="18" height="2" rx="1" />
            </g>
          </g>
        </defs>
      </svg>
    `;
    if (host.firstElementChild) document.body.appendChild(host.firstElementChild);
  };

  const KNIA_SIM_SPECS = (() => {
    const arrowE = (x, y) => `<path d="M ${x - 7} ${y - 0.7} H ${x + 4.2} L ${x + 1.6} ${y - 3.4} L ${x + 2.6} ${y - 4.3} L ${x + 8.5} ${y} L ${x + 2.6} ${y + 4.3} L ${x + 1.6} ${y + 3.4} L ${x + 4.2} ${y + 0.7} H ${x - 7} Z" fill="var(--ux-sim-arrow)" />`;
    const arrowS = (x, y) => `<path d="M ${x - 0.7} ${y - 7} V ${y + 4.2} L ${x - 3.4} ${y + 1.6} L ${x - 4.3} ${y + 2.6} L ${x} ${y + 8.5} L ${x + 4.3} ${y + 2.6} L ${x + 3.4} ${y + 1.6} L ${x + 0.7} ${y + 4.2} V ${y - 7} Z" fill="var(--ux-sim-arrow)" />`;

    const rbDashes = Array.from({ length: 12 }, (_, i) => {
      const a = (i * 30 * Math.PI) / 180;
      const x = +(122 + 56 * Math.cos(a)).toFixed(1);
      const y = +(90 + 56 * Math.sin(a)).toFixed(1);
      return `<rect x="${x - 3.5}" y="${y - 0.9}" width="7" height="1.8" rx="0.9" transform="rotate(${i * 30 + 90} ${x} ${y})" />`;
    }).join('');

    return {
      tbone_green: {
        lutA: createSimPathLut([['line', 42, 108, 304, 108, 16]]),
        lutB: createSimPathLut([['line', 142, 16, 142, 174, 16]]),
        stopA: 68.5,
        stopB: 86,
        decelA: true,
        gradA: 'url(#ux-knia-a-e)',
        gradB: 'url(#ux-knia-b-s)',
        impact: [132.5, 108],
        breachY: 34,
        envHtml: `
          <use href="#ux-knia-cross-grid" />
          <rect x="126" y="34" width="32" height="2" rx="1" fill="var(--ux-sim-stopbar)" />
          <rect data-sim-breach x="125" y="33.4" width="34" height="3.2" rx="1.6" fill="var(--ux-sim-sig-red)" opacity="0.22" />
          ${arrowE(76, 108)}${arrowS(142, 20)}
          <use href="#ux-knia-sig-green" transform="translate(88, 146)" />
          <use href="#ux-knia-sig-red" transform="translate(96, 28)" />
        `,
      },
      tbone_red: {
        lutA: createSimPathLut([['line', 58, 108, 304, 108, 16]]),
        lutB: createSimPathLut([['line', 142, 14, 142, 174, 16]]),
        stopA: 84,
        stopB: 62.5,
        gradA: 'url(#ux-knia-a-e)',
        gradB: 'url(#ux-knia-b-s)',
        impact: [142, 98.5],
        breachY: 34,
        envHtml: `
          <use href="#ux-knia-cross-grid" />
          <rect x="126" y="0" width="32" height="34" fill="url(#ux-knia-red-corridor)" mask="url(#ux-knia-road-mask)" />
          <rect x="126" y="34" width="32" height="2" rx="1" fill="var(--ux-sim-stopbar)" />
          <rect data-sim-breach x="125" y="33.4" width="34" height="3.2" rx="1.6" fill="var(--ux-sim-sig-red)" opacity="0.26" />
          ${arrowE(76, 108)}${arrowS(142, 20)}
          <use href="#ux-knia-sig-green" transform="translate(88, 146)" />
          <use href="#ux-knia-sig-red" transform="translate(96, 28)" />
        `,
      },
      lane_cutin: {
        lutA: createSimPathLut([['line', 40, 123, 304, 123, 16]]),
        lutB: createSimPathLut([
          ['line', 34, 57, 94, 57, 12],
          ['cubic', 94, 57, 152, 57, 158, 118, 224, 123, 40],
          ['line', 224, 123, 304, 123, 12],
        ]),
        stopA: 108.8,
        stopFracB: 0.57,
        decelA: true,
        gradA: 'url(#ux-knia-a-e)',
        gradB: 'url(#ux-knia-b-e)',
        impact: [169, 115],
        envHtml: `
          <use href="#ux-knia-highway-grid" />
          ${arrowE(62, 57)}${arrowE(62, 123)}${arrowE(264, 123)}
        `,
      },
      rear_end: {
        lutA: createSimPathLut([['line', 220, 123, 286, 123, 4]]),
        lutB: createSimPathLut([['line', 46, 123, 276, 123, 16]]),
        stopA: 0,
        stopB: 130,
        stationaryA: true,
        gradA: 'url(#ux-knia-a-e)',
        gradB: 'url(#ux-knia-b-e)',
        impact: [198, 123],
        envHtml: `
          <use href="#ux-knia-highway-grid" />
          <g fill="var(--ux-sim-marking)" mask="url(#ux-knia-road-mask)">
            <rect x="264" y="32" width="12" height="5" rx="1" />
            <rect x="264" y="46" width="12" height="5" rx="1" />
            <rect x="264" y="60" width="12" height="5" rx="1" />
            <rect x="264" y="74" width="12" height="5" rx="1" />
            <rect x="264" y="102" width="12" height="5" rx="1" />
            <rect x="264" y="116" width="12" height="5" rx="1" />
            <rect x="264" y="130" width="12" height="5" rx="1" />
            <rect x="264" y="144" width="12" height="5" rx="1" />
          </g>
          <rect x="256" y="94" width="2" height="58" rx="1" fill="var(--ux-sim-stopbar)" />
          ${arrowE(86, 123)}
        `,
      },
      left_turn: {
        lutA: createSimPathLut([['line', 34, 108, 304, 108, 16]]),
        lutB: createSimPathLut([
          ['line', 286, 72, 210, 72, 16],
          ['quad', 210, 72, 142, 72, 142, 174, 48],
        ]),
        stopA: 84.8,
        stopFracB: 0.61,
        decelA: true,
        blinkB: 'left',
        gradA: 'url(#ux-knia-a-e)',
        gradB: 'url(#ux-knia-b-curve)',
        impact: [141, 104],
        envHtml: `
          <use href="#ux-knia-cross-grid" />
          <rect x="214" y="56" width="2" height="32" rx="1" fill="var(--ux-sim-stopbar)" />
          ${arrowE(76, 108)}
          <path d="M 250 71.3 V 72.7 H 235.5 Q 229.7 72.7 229.7 78.5 V 81.2 L 232.2 78.7 L 233.2 79.6 L 229 85.2 L 224.8 79.6 L 225.8 78.7 L 228.3 81.2 V 78.5 Q 228.3 71.3 235.5 71.3 Z" fill="var(--ux-sim-arrow)" />
          <use href="#ux-knia-sig-green" transform="translate(88, 146)" />
          <g transform="translate(230, 28)">
            <use href="#ux-knia-sig-green" />
            <rect x="19" y="-6.5" width="13" height="13" rx="3.2" fill="url(#ux-knia-turn-sign)" />
            <path d="M 27.6 3.2 V -2.0 H 24.4 L 25.8 -0.6 L 25.0 0.2 L 21.8 -2.6 L 25.0 -5.4 L 25.8 -4.6 L 24.4 -3.2 H 28.8 V 3.2 Z" fill="var(--ux-sim-badge-text)" />
          </g>
        `,
      },
      roundabout: {
        lutA: createSimPathLut([['arc', 122, 90, 68, 96, -46, 48]]),
        lutB: createSimPathLut([
          ['line', 290, 70, 214, 70, 14],
          ['quad', 214, 70, 190, 70, 172, 34, 24],
        ]),
        stopFracA: 0.626,
        stopFracB: 0.60,
        decelA: true,
        gradA: 'url(#ux-knia-a-ccw)',
        gradB: 'url(#ux-knia-b-nw)',
        impact: [192, 75],
        envHtml: `
          <g mask="url(#ux-knia-road-mask)">
            <path d="M 174 50 H 320 V 130 H 174 Z" fill="url(#ux-knia-asphalt-grad)" />
            <circle cx="122" cy="90" r="84" fill="url(#ux-knia-asphalt-grad)" />
            <circle cx="122" cy="90" r="28" fill="var(--ux-sim-stage-bg)" />
            <g fill="var(--ux-sim-marking)">${rbDashes}</g>
            <g fill="var(--ux-sim-centerline)" fill-opacity="0.58">
              <rect x="218" y="88.4" width="102" height="1.1" rx="0.55" />
              <rect x="218" y="91.0" width="102" height="1.1" rx="0.55" />
            </g>
            <g fill="var(--ux-sim-stopbar)">
              <rect x="208" y="56" width="2" height="6" rx="1" />
              <rect x="208" y="66" width="2" height="6" rx="1" />
              <rect x="208" y="76" width="2" height="6" rx="1" />
            </g>
          </g>
          <path d="M 260 69.3 H 248.8 L 251.4 66.6 L 250.4 65.7 L 244.5 70 L 250.4 74.3 L 251.4 73.4 L 248.8 70.7 H 260 Z" fill="var(--ux-sim-arrow)" />
        `,
      },
      uturn: {
        lutA: createSimPathLut([['line', 34, 148, 304, 148, 16]]),
        lutB: createSimPathLut([
          ['line', 284, 76, 168, 76, 16],
          ['arc', 168, 112, 36, -90, -270, 40],
          ['line', 168, 148, 286, 148, 14],
        ]),
        stopA: 72.3,
        stopFracB: 0.59,
        decelA: true,
        blinkB: 'left',
        gradA: 'url(#ux-knia-a-e)',
        gradB: 'url(#ux-knia-b-uturn)',
        impact: [128, 142],
        envHtml: `
          <g mask="url(#ux-knia-road-mask)">
            <rect x="0" y="22" width="320" height="144" fill="url(#ux-knia-asphalt-grad)" />
            <g fill="var(--ux-sim-centerline)" fill-opacity="0.60">
              <rect x="0" y="92.6" width="124" height="1.1" rx="0.55" />
              <rect x="0" y="95.3" width="124" height="1.1" rx="0.55" />
              <rect x="196" y="92.6" width="124" height="1.1" rx="0.55" />
              <rect x="196" y="95.3" width="124" height="1.1" rx="0.55" />
            </g>
            <g fill="var(--ux-sim-marking)">
              <rect x="132" y="93.6" width="14" height="2" rx="1" />
              <rect x="154" y="93.6" width="14" height="2" rx="1" />
              <rect x="176" y="93.6" width="14" height="2" rx="1" />
              <rect x="24" y="58" width="18" height="1.5" rx="0.75" />
              <rect x="82" y="58" width="18" height="1.5" rx="0.75" />
              <rect x="220" y="58" width="18" height="1.5" rx="0.75" />
              <rect x="24" y="130" width="18" height="1.5" rx="0.75" />
              <rect x="220" y="130" width="18" height="1.5" rx="0.75" />
            </g>
          </g>
          ${arrowE(68, 148)}
          <g transform="translate(161, 11)">
            <rect x="-7" y="-7" width="14" height="14" rx="3.5" fill="url(#ux-knia-turn-sign)" />
            <path d="M 3.2 3.4 V -0.4 A 3.0 3.0 0 1 0 -2.8 -0.4 V 1.4 L -4.4 -0.2 L -5.2 0.6 L -2.2 3.8 L 0.8 0.6 L 0 -0.2 L -1.4 1.4 V -0.4 A 1.6 1.6 0 1 1 1.8 -0.4 V 3.4 Z" fill="var(--ux-sim-badge-text)" />
          </g>
        `,
      },
      parking_back: {
        lutA: createSimPathLut([['line', 190, 138, 190, 34, 16]]),
        lutB: createSimPathLut([['line', 40, 52, 300, 52, 16]]),
        stopA: 64,
        stopB: 118.5,
        reverseA: true,
        decelA: true,
        gradA: 'url(#ux-knia-a-n)',
        gradB: 'url(#ux-knia-b-e)',
        impact: [180.5, 55],
        envHtml: `
          <g mask="url(#ux-knia-road-mask)">
            <path d="M 0 14 H 320 V 90 H 280 V 176 H 40 V 90 H 0 Z" fill="url(#ux-knia-asphalt-grad)" />
            <g fill="var(--ux-sim-marking)">
              <rect x="40" y="90" width="1.6" height="82" rx="0.8" />
              <rect x="100" y="90" width="1.6" height="82" rx="0.8" />
              <rect x="160" y="90" width="1.6" height="82" rx="0.8" />
              <rect x="220" y="90" width="1.6" height="82" rx="0.8" />
              <rect x="280" y="90" width="1.6" height="82" rx="0.8" />
            </g>
            <g fill="var(--ux-sim-centerline)" fill-opacity="0.48">
              <rect x="56" y="164" width="28" height="2.4" rx="1.2" />
              <rect x="116" y="164" width="28" height="2.4" rx="1.2" />
              <rect x="176" y="164" width="28" height="2.4" rx="1.2" />
              <rect x="236" y="164" width="28" height="2.4" rx="1.2" />
            </g>
          </g>
          ${arrowE(76, 52)}
        `,
      },
      crosswalk: {
        lutA: createSimPathLut([
          ['line', 34, 108, 104, 108, 14],
          ['quad', 104, 108, 142, 108, 142, 174, 36],
        ]),
        lutB: createSimPathLut([['line', 196, 136, 114, 136, 16]]),
        stopFracA: 0.554,
        stopB: 54,
        decelA: true,
        blinkA: 'right',
        pedB: true,
        gradA: 'url(#ux-knia-a-se)',
        gradB: 'url(#ux-knia-b-nw)',
        impact: [140, 128],
        envHtml: `
          <use href="#ux-knia-cross-grid" />
          <g fill="var(--ux-sim-marking)" opacity="0.85">
            <rect x="129" y="130" width="4" height="12" rx="1" />
            <rect x="138" y="130" width="4" height="12" rx="1" />
            <rect x="147" y="130" width="4" height="12" rx="1" />
            <rect x="169" y="130" width="4" height="12" rx="1" />
            <rect x="178" y="130" width="4" height="12" rx="1" />
            <rect x="187" y="130" width="4" height="12" rx="1" />
          </g>
          <path d="M 68 107.3 H 77.5 Q 84.7 107.3 84.7 114.5 V 117.2 L 87.2 114.7 L 88.2 115.6 L 84 121.2 L 79.8 115.6 L 80.8 114.7 L 83.3 117.2 V 114.5 Q 83.3 108.7 77.5 108.7 H 68 Z" fill="var(--ux-sim-arrow)" />
          <use href="#ux-knia-sig-green" transform="translate(88, 146)" />
          <g transform="translate(208, 144)">
            <circle cx="0" cy="0" r="6" fill="url(#ux-knia-glow-green)" />
            <circle cx="0" cy="0" r="2.6" fill="var(--ux-sim-sig-green)" />
          </g>
        `,
      },
      uncontrolled: {
        lutA: createSimPathLut([['line', 42, 108, 304, 108, 16]]),
        lutB: createSimPathLut([['line', 142, 16, 142, 174, 16]]),
        stopA: 68.5,
        stopB: 86,
        decelA: true,
        gradA: 'url(#ux-knia-a-e)',
        gradB: 'url(#ux-knia-b-s)',
        impact: [132.5, 108],
        envHtml: `
          <use href="#ux-knia-cross-grid" />
          <rect x="126" y="34" width="32" height="2" rx="1" fill="var(--ux-sim-stopbar)" />
          ${arrowE(76, 108)}${arrowS(142, 20)}
        `,
      },
    };
  })();

  const applyScenarioSimFrame = (svgEl, progress, nowMs = 0) => {
    if (!svgEl) return;
    const simType = svgEl.dataset.uxSimType || 'tbone_green';
    const spec = KNIA_SIM_SPECS[simType] || KNIA_SIM_SPECS.tbone_green;
    const preU = Math.min(1, progress / KNIA_SIM_IMPACT_T);
    const postU = progress > KNIA_SIM_IMPACT_T
      ? Math.min(1, (progress - KNIA_SIM_IMPACT_T) / (KNIA_SIM_SETTLE_T - KNIA_SIM_IMPACT_T))
      : 0;
    const settle = simSmoothStep(0, 1, postU) * 1.1;

    const dynEl = svgEl.querySelector('[data-sim-dyn]');
    if (dynEl) {
      const autoPlay = svgEl.dataset.uxSimPlaying === 'true';
      const entryAlpha = autoPlay && progress < 0.06 ? simSmoothStep(0, 0.06, progress) : 1;
      dynEl.setAttribute('opacity', entryAlpha.toFixed(2));
    }

    const endDistA = spec.stopFracA !== undefined ? spec.lutA.total * spec.stopFracA : (spec.stopA ?? 0);
    const moveRatioA = spec.decelA ? simApproachCurve(preU) : preU;
    const distA = spec.stationaryA ? 0 : moveRatioA * endDistA + settle;
    const poseA = sampleSimLut(spec.lutA, distA);
    const carDegA = spec.reverseA ? poseA.deg + 180 : poseA.deg;

    const endDistB = spec.stopFracB !== undefined ? spec.lutB.total * spec.stopFracB : (spec.stopB ?? 0);
    const distB = preU * endDistB + settle * 0.6;
    const poseB = sampleSimLut(spec.lutB, distB);
    const carDegB = spec.pedB ? 0 : poseB.deg;

    const carAEl = svgEl.querySelector('[data-sim-car-a]');
    const badgeAEl = svgEl.querySelector('[data-sim-badge-a]');
    const brakeAEl = svgEl.querySelector('[data-sim-brake-a]');
    const revAEl = svgEl.querySelector('[data-sim-rev-a]');
    if (carAEl) carAEl.setAttribute('transform', `translate(${poseA.x.toFixed(1)}, ${poseA.y.toFixed(1)}) rotate(${carDegA.toFixed(1)})`);
    if (badgeAEl) badgeAEl.setAttribute('transform', `translate(${spec.reverseA ? '3.5' : '-4.4'}, 0) rotate(${(-carDegA).toFixed(1)})`);
    if (brakeAEl) {
      const braking = spec.stationaryA || (spec.decelA && preU >= 0.65) || progress >= KNIA_SIM_IMPACT_T;
      brakeAEl.setAttribute('opacity', braking ? '1' : '0.45');
    }
    if (revAEl) revAEl.setAttribute('opacity', spec.reverseA ? '0.95' : '0');

    const carBEl = svgEl.querySelector('[data-sim-car-b]');
    const badgeBEl = svgEl.querySelector('[data-sim-badge-b]');
    if (carBEl) carBEl.setAttribute('transform', `translate(${poseB.x.toFixed(1)}, ${poseB.y.toFixed(1)}) rotate(${carDegB.toFixed(1)})`);
    if (badgeBEl) badgeBEl.setAttribute('transform', spec.pedB ? 'translate(0, 0)' : `translate(-4.4, 0) rotate(${(-carDegB).toFixed(1)})`);

    const blinkOn = progress >= 1.0 ? '0.82' : (Math.sin(nowMs * 0.014) > 0 ? '0.95' : '0.18');
    svgEl.querySelectorAll('[data-sim-blink-a]').forEach((el) => el.setAttribute('opacity', spec.blinkA ? blinkOn : '0'));
    svgEl.querySelectorAll('[data-sim-blink-b]').forEach((el) => el.setAttribute('opacity', spec.blinkB ? blinkOn : '0'));

    if (spec.breachY !== undefined) {
      const breachEl = svgEl.querySelector('[data-sim-breach]');
      if (breachEl) breachEl.setAttribute('opacity', poseB.y + 22 >= spec.breachY ? '0.92' : '0.22');
    }

    const updateRibbon = (rbSelector, chPrefix, lut, dist, hidden, halfW = 10) => {
      const rbEl = svgEl.querySelector(rbSelector);
      if (rbEl) {
        if (hidden) {
          rbEl.setAttribute('d', '');
        } else {
          const ribStart = Math.min(lut.total - 6, dist + (halfW <= 6 ? 6 : 15));
          rbEl.setAttribute('d', buildRibbonPolyOnLut(lut, ribStart, lut.total, halfW));
        }
      }
      const ribStart = dist + (halfW <= 6 ? 6 : 15);
      const ribLen = Math.max(0, lut.total - ribStart);
      const flow = (dist * 0.35) % KNIA_SIM_CHEV_STEP;
      for (let i = 0; i < KNIA_SIM_SLOT_COUNT; i += 1) {
        const chEl = svgEl.querySelector(`[data-sim-ch-${chPrefix}="${i}"]`);
        if (!chEl) continue;
        const sLocal = flow + i * KNIA_SIM_CHEV_STEP;
        if (hidden || sLocal <= 4 || sLocal >= ribLen - 4) {
          chEl.setAttribute('opacity', '0');
          continue;
        }
        const fadeIn = simSmoothStep(4, 22, sLocal);
        const fadeOut = 1 - simSmoothStep(ribLen * 0.40, ribLen - 4, sLocal);
        const alpha = fadeIn * fadeOut * 0.54;
        if (alpha <= 0.01) {
          chEl.setAttribute('opacity', '0');
          continue;
        }
        const cPt = sampleSimLut(lut, ribStart + sLocal);
        chEl.setAttribute('transform', `translate(${cPt.x.toFixed(1)}, ${cPt.y.toFixed(1)}) rotate(${cPt.deg.toFixed(1)})`);
        chEl.setAttribute('opacity', alpha.toFixed(2));
      }
    };

    updateRibbon('[data-sim-rb-a]', 'a', spec.lutA, distA, Boolean(spec.stationaryA), 10);
    updateRibbon('[data-sim-rb-b]', 'b', spec.lutB, distB, false, spec.pedB ? 5.5 : 10);

    const impEl = svgEl.querySelector('[data-sim-impact]');
    const impR1 = svgEl.querySelector('[data-sim-imp-r1]');
    const impR2 = svgEl.querySelector('[data-sim-imp-r2]');
    if (impEl && impR1 && impR2) {
      if (progress < KNIA_SIM_IMPACT_T) {
        impEl.setAttribute('opacity', '0');
      } else {
        const age = Math.min(1, (progress - KNIA_SIM_IMPACT_T) / (1 - KNIA_SIM_IMPACT_T));
        const ease = 1 - Math.pow(1 - age, 2.2);
        impEl.setAttribute('opacity', '1');
        impR1.setAttribute('r', (6 + ease * 17).toFixed(1));
        impR1.setAttribute('opacity', ((1 - age) * 0.90).toFixed(2));
        const age2 = Math.max(0, Math.min(1, (age - 0.16) / 0.84));
        const ease2 = 1 - Math.pow(1 - age2, 2.2);
        impR2.setAttribute('r', (9 + ease2 * 23).toFixed(1));
        impR2.setAttribute('opacity', (age > 0.16 ? (1 - age2) * 0.55 : 0).toFixed(2));
      }
    }
  };

  const isSimReducedMotion = () => (
    document.documentElement.dataset.reducedMotion === 'true'
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const stopScenarioSimulation = (svgEl) => {
    if (!svgEl) return;
    const state = kniaSimStates.get(svgEl);
    if (state?.rafId) cancelAnimationFrame(state.rafId);
    svgEl.dataset.uxSimPlaying = 'false';
    kniaSimStates.set(svgEl, { progress: 1.0, rafId: 0 });
    applyScenarioSimFrame(svgEl, 1.0, performance.now());
  };

  const playScenarioSimulation = (svgEl, { force = false } = {}) => {
    if (!svgEl) return;
    const prev = kniaSimStates.get(svgEl);
    if (prev?.rafId) cancelAnimationFrame(prev.rafId);
    if (!force && isSimReducedMotion()) {
      stopScenarioSimulation(svgEl);
      return;
    }
    const state = { progress: 0.0, lastTs: performance.now(), rafId: 0 };
    svgEl.dataset.uxSimPlaying = 'true';
    kniaSimStates.set(svgEl, state);
    applyScenarioSimFrame(svgEl, 0.0, state.lastTs);
    const tick = (now) => {
      if (!svgEl.isConnected) {
        state.rafId = 0;
        return;
      }
      const dt = Math.min(48, now - state.lastTs);
      state.lastTs = now;
      state.progress = Math.min(1.0, state.progress + dt / KNIA_SIM_PLAY_MS);
      applyScenarioSimFrame(svgEl, state.progress, now);
      if (state.progress < 1.0) {
        state.rafId = requestAnimationFrame(tick);
      } else {
        svgEl.dataset.uxSimPlaying = 'false';
        state.rafId = 0;
      }
    };
    state.rafId = requestAnimationFrame(tick);
  };

  const mountScenarioSimulations = (rootEl) => {
    if (!rootEl) return;
    rootEl.querySelectorAll('svg[data-ux-sim-type]').forEach((svgEl) => {
      if (svgEl.dataset.uxSimAuto === 'true') {
        playScenarioSimulation(svgEl, { force: false });
      } else {
        applyScenarioSimFrame(svgEl, 1.0, performance.now());
      }
    });
  };

  const buildScenarioSimulationSvg = (ch, { animated = true } = {}) => {
    ensureKniaSimDefs();
    const sim = KNIA_SIM_SPECS[ch.simType] ? ch.simType : 'tbone_green';
    const spec = KNIA_SIM_SPECS[sim];
    const chevSlots = (prefix) => Array.from({ length: KNIA_SIM_SLOT_COUNT }, (_, i) => (
      `<use data-sim-ch-${prefix}="${i}" href="#ux-knia-chevron" opacity="0" />`
    )).join('');
    const poseA = sampleSimLut(spec.lutA, spec.stationaryA ? 0 : (spec.stopFracA !== undefined ? spec.lutA.total * spec.stopFracA : spec.stopA) + 1.1);
    const carDegA = spec.reverseA ? poseA.deg + 180 : poseA.deg;
    const poseB = sampleSimLut(spec.lutB, (spec.stopFracB !== undefined ? spec.lutB.total * spec.stopFracB : spec.stopB) + 0.66);
    const carDegB = spec.pedB ? 0 : poseB.deg;
    const rbStartA = Math.min(spec.lutA.total - 6, poseA.dist + 15);
    const rbPathA = spec.stationaryA ? '' : buildRibbonPolyOnLut(spec.lutA, rbStartA, spec.lutA.total, 10);
    const rbStartB = Math.min(spec.lutB.total - 6, poseB.dist + (spec.pedB ? 6 : 15));
    const rbPathB = buildRibbonPolyOnLut(spec.lutB, rbStartB, spec.lutB.total, spec.pedB ? 5.5 : 10);
    const [impX, impY] = spec.impact;
    const blinkCyA = spec.blinkA === 'right' ? 7.6 : -7.6;
    const blinkRCyA = spec.blinkA === 'right' ? 7.2 : -7.2;

    return `
      <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" class="ux-as-sim__svg" data-ux-sim-type="${esc(sim)}" data-ux-sim-auto="${animated ? 'true' : 'false'}" fill="none" aria-hidden="true">
        ${spec.envHtml}
        <g data-sim-dyn>
          <path data-sim-rb-a d="${rbPathA}" fill="${spec.gradA}" />
          ${chevSlots('a')}
          <path data-sim-rb-b d="${rbPathB}" fill="${spec.gradB}" />
          ${chevSlots('b')}

          <g data-sim-car-b transform="translate(${poseB.x.toFixed(1)}, ${poseB.y.toFixed(1)}) rotate(${carDegB.toFixed(1)})">
            <use href="${spec.pedB ? '#ux-knia-ped-b' : '#ux-knia-car-b-body'}" />
            ${spec.pedB ? '' : `
              <circle data-sim-blink-b cx="19.5" cy="-7.6" r="2.2" fill="var(--ux-sim-impact-core)" opacity="${spec.blinkB ? '0.82' : '0'}" />
              <circle data-sim-blink-b cx="-19.5" cy="-7.2" r="2.0" fill="var(--ux-sim-impact-core)" opacity="${spec.blinkB ? '0.82' : '0'}" />
            `}
            <g data-sim-badge-b transform="${spec.pedB ? 'translate(0, 0)' : `translate(-4.4, 0) rotate(${(-carDegB).toFixed(1)})`}">
              <circle r="${spec.pedB ? '5.4' : '6'}" fill="var(--ux-sim-party-b-solid)" />
              <text x="0" y="0.4" text-anchor="middle" dominant-baseline="central" class="ux-as-sim__badge-text">B</text>
            </g>
          </g>

          <g data-sim-car-a transform="translate(${poseA.x.toFixed(1)}, ${poseA.y.toFixed(1)}) rotate(${carDegA.toFixed(1)})">
            <use href="#ux-knia-car-a-body" />
            <rect data-sim-brake-a x="-21.4" y="-5.6" width="1.5" height="11.2" rx="0.75" fill="var(--ux-sim-sig-red)" opacity="${spec.stationaryA || spec.decelA ? '1' : '0.45'}" />
            <g data-sim-rev-a opacity="${spec.reverseA ? '0.95' : '0'}">
              <rect x="-21.8" y="-5.0" width="1.6" height="2.6" rx="0.7" fill="var(--ux-sim-badge-text)" />
              <rect x="-21.8" y="2.4" width="1.6" height="2.6" rx="0.7" fill="var(--ux-sim-badge-text)" />
            </g>
            <circle data-sim-blink-a cx="19.5" cy="${blinkCyA}" r="2.2" fill="var(--ux-sim-impact-core)" opacity="${spec.blinkA ? '0.82' : '0'}" />
            <circle data-sim-blink-a cx="-19.5" cy="${blinkRCyA}" r="2.0" fill="var(--ux-sim-impact-core)" opacity="${spec.blinkA ? '0.82' : '0'}" />
            <g data-sim-badge-a transform="translate(${spec.reverseA ? '3.5' : '-4.4'}, 0) rotate(${(-carDegA).toFixed(1)})">
              <circle r="6" fill="var(--ux-sim-party-a-solid)" />
              <text x="0" y="0.4" text-anchor="middle" dominant-baseline="central" class="ux-as-sim__badge-text">A</text>
            </g>
          </g>

          <g data-sim-impact transform="translate(${impX}, ${impY})" opacity="1">
            <circle data-sim-imp-r1 r="23" fill="url(#ux-knia-impact-wave)" opacity="0" />
            <circle data-sim-imp-r2 r="32" fill="url(#ux-knia-impact-wave)" opacity="0" />
            <circle r="9.5" fill="url(#ux-knia-impact-core)" />
          </g>
        </g>
      </svg>
    `;
  };

  let condThumbTipEl = null;
  const getCondThumbTipEl = () => {
    if (condThumbTipEl && condThumbTipEl.isConnected) return condThumbTipEl;
    const tip = document.createElement('div');
    tip.className = 'ux-cond-thumb-tip';
    tip.setAttribute('role', 'tooltip');
    tip.hidden = true;
    tip.innerHTML = (
      '<div class="ux-cond-thumb-tip__media"><img class="ux-cond-thumb-tip__img" src="" alt="" decoding="async" /></div>' +
      '<div class="ux-cond-thumb-tip__meta"><span class="ux-cond-thumb-tip__cam" data-ux-tip-cam></span><span class="ux-num" data-ux-tip-time></span></div>'
    );
    document.body.appendChild(tip);
    condThumbTipEl = tip;
    return tip;
  };

  const showCondThumbTip = (btn) => {
    if (!btn) return;
    const cam = Math.max(1, Math.min(4, Number(btn.dataset.uxCondCam) || 1));
    const time = btn.dataset.uxCondTime || '12.4';
    const tip = getCondThumbTipEl();
    const img = tip.querySelector('.ux-cond-thumb-tip__img');
    const camEl = tip.querySelector('[data-ux-tip-cam]');
    const timeEl = tip.querySelector('[data-ux-tip-time]');
    const src = `./assets/video-thumbs/cam-0${cam}.jpg`;
    if (img && img.getAttribute('src') !== src) img.setAttribute('src', src);
    if (camEl) camEl.textContent = getCamShortName(cam);
    if (timeEl) timeEl.textContent = `0:${time}`;

    tip.hidden = false;
    tip.dataset.open = 'false';
    const r = btn.getBoundingClientRect();
    const tipW = 184;
    const tipH = 132;
    const vw = window.innerWidth || 1280;
    const left = Math.max(8, Math.min(vw - tipW - 8, r.left + (r.width - tipW) / 2));
    const aboveTop = r.top - tipH - 8;
    const top = aboveTop >= 8 ? aboveTop : Math.min((window.innerHeight || 800) - tipH - 8, r.bottom + 8);
    tip.style.left = `${Math.round(left)}px`;
    tip.style.top = `${Math.round(top)}px`;
    requestAnimationFrame(() => {
      if (tip.isConnected && !tip.hidden) tip.dataset.open = 'true';
    });
  };

  const hideCondThumbTip = () => {
    if (!condThumbTipEl) return;
    condThumbTipEl.dataset.open = 'false';
    condThumbTipEl.hidden = true;
  };

  const reanalyseLayerEl = document.querySelector('[data-ux-reanalyse-layer]');
  const reanalyseScrimEl = document.querySelector('[data-ux-reanalyse-scrim]');
  const reanalyseSheetEl = document.querySelector('[data-ux-reanalyse-sheet]');
  const videoPanelScrollEl = document.querySelector('[data-video-panel]');
  let reanalyseCloseTimer = 0;
  let silentReanalyseVideoSync = false;

  const formatMasterShort = (sec) => {
    const clamped = Math.max(0, Math.min(30, Number(sec) || 0));
    const mins = Math.floor(clamped / 60);
    const secs = (clamped % 60).toFixed(1).padStart(4, '0');
    return `${mins}:${secs}`;
  };

  const formatStep1ContextCue = (ctx) => {
    if (!ctx || ctx.mode === 'none') return '';
    const camName = getCamShortName(ctx.cam || 1);
    if (ctx.mode === 'range') {
      return `${camName} · ${formatMasterShort(ctx.startMasterSec)}–${formatMasterShort(ctx.endMasterSec)}`;
    }
    return `${camName} · ${formatMasterShort(ctx.masterSec)}`;
  };

  const renderStep2ContextBadgeHtml = (ctx, { interactive = true, active = false } = {}) => {
    if (!ctx) return '';
    const camName = getCamShortName(ctx.cam || 1);
    if (ctx.mode === 'none') {
      return '<span class="ds-badge ds-badge--default ds-badge--pill">General</span>';
    }
    if (ctx.mode === 'range') {
      const sSec = Math.max(0, Math.min(29.5, Number(ctx.startMasterSec) || 0));
      const eSec = Math.max(sSec + 0.5, Math.min(30, Number(ctx.endMasterSec) || sSec + 1));
      const mapX = (sec) => Math.max(4, Math.min(156, Math.round((Math.max(0, Math.min(30, sec)) / 30) * 152) + 4));
      const x1 = Math.min(138, mapX(sSec));
      const segW = Math.max(18, Math.min(156 - x1, mapX(eSec) - x1));
      const sLabel = formatMasterShort(sSec);
      const eLabel = formatMasterShort(eSec);
      const inner = `
        <span class="ux-cue-track__cam">${esc(camName)}</span>
        <span class="ux-cue-track__time ux-num">${esc(sLabel)}</span>
        <svg class="ux-cue-track__svg" viewBox="0 0 160 14" width="156" height="14" fill="none" aria-hidden="true">
          <rect class="ux-cue-track__bg" x="2" y="5" width="156" height="4" rx="2" />
          <rect class="ux-cue-track__seg" x="${x1}" y="5" width="${segW}" height="4" rx="2" />
        </svg>
        <span class="ux-cue-track__time ux-num">${esc(eLabel)}</span>
      `;
      if (!interactive) {
        return `<span class="ux-cue-track" data-active="${active}">${inner}</span>`;
      }
      return `<button type="button" class="ux-cue-track" data-ux-reanalyse-cue-jump="${esc(ctx.id)}" data-active="${active}" aria-label="Jump to ${esc(camName)} ${esc(sLabel)} to ${esc(eLabel)}">${inner}</button>`;
    }
    const tLabel = formatMasterShort(ctx.masterSec);
    if (!interactive) {
      return `<span class="ux-ev-tag" data-active="${active}">${ICON_CLOCK_SM}<span>${esc(camName)} · ${esc(tLabel)}</span></span>`;
    }
    return `<button type="button" class="ux-ev-tag" data-ux-reanalyse-cue-jump="${esc(ctx.id)}" data-active="${active}" aria-label="Jump to ${esc(camName)} at ${esc(tLabel)}">${ICON_CLOCK_SM}<span>${esc(camName)} · ${esc(tLabel)}</span></button>`;
  };

  const getStep1RerunTriggerBtn = () => step1WrapEl?.querySelector('[data-ux-tool-rerun]') || null;

  const isStep1ReanalyseOpen = () => Boolean(
    store.step1ReanalyseDraft?.open
    && reanalyseLayerEl
    && !reanalyseLayerEl.hidden
  );

  const isStep2EvidenceSheetOpen = () => Boolean(
    store.evidenceDraft?.open
    && reanalyseLayerEl
    && !reanalyseLayerEl.hidden
  );

  const isTimelineSpotlightOpen = () => isStep1ReanalyseOpen() || isStep2EvidenceSheetOpen();

  function syncReanalyseSheetPosition() {
    if (!reanalyseSheetEl || !detailWorkspacesEl || !isTimelineSpotlightOpen()) return;
    if (window.innerWidth <= 900) {
      reanalyseSheetEl.style.removeProperty('--reanalyse-top');
      reanalyseSheetEl.style.removeProperty('--reanalyse-caret-y');
      return;
    }
    const wsRect = detailWorkspacesEl.getBoundingClientRect();
    const tlRect = document.querySelector('.ds-video-timeline')?.getBoundingClientRect();
    const sheetH = reanalyseSheetEl.offsetHeight || 480;
    const pad = 16;
    if (tlRect && wsRect.height > 0) {
      const maxTop = Math.max(pad, wsRect.height - sheetH - pad);
      const idealTop = tlRect.top - wsRect.top;
      const clampedTop = Math.max(pad, Math.min(maxTop, idealTop));
      const tlAnchorY = tlRect.top + Math.min(96, Math.max(40, tlRect.height * 0.28));
      const caretY = Math.max(40, Math.min(Math.max(40, sheetH - 40), tlAnchorY - (wsRect.top + clampedTop)));
      reanalyseSheetEl.style.setProperty('--reanalyse-top', `${Math.round(clampedTop)}px`);
      reanalyseSheetEl.style.setProperty('--reanalyse-caret-y', `${Math.round(caretY)}px`);
    }
  }

  const silentJumpVideoForReanalyse = (camId, masterSec) => {
    silentReanalyseVideoSync = true;
    try {
      bridge.setVideoPlaying(false);
      if (camId) bridge.setActiveCamera(String(camId));
      if (Number.isFinite(masterSec)) bridge.setScrubberValue(masterSec - 2.6);
    } finally {
      silentReanalyseVideoSync = false;
    }
  };

  const syncReanalyseDraftToTimeline = (draft, { jumpVideo = false } = {}) => {
    if (!draft?.open) {
      bridge.setTimelineDraftMode?.(false);
      bridge.setTimelineFocusRange?.(null);
      bridge.setTimelineContextMarkers?.([]);
      return;
    }
    bridge.setTimelineDraftMode?.(true);
    const activeJumpId = draft.editingId || draft.focusedItemId || null;
    const markers = (draft.items || [])
      .filter((item) => item.mode === 'moment' || item.mode === 'range')
      .map((item) => ({
        id: item.id,
        mode: item.mode,
        masterSec: item.masterSec,
        startMasterSec: item.startMasterSec,
        endMasterSec: item.endMasterSec,
        active: activeJumpId === item.id,
        title: `${formatStep1ContextCue(item)}: ${item.text}`,
      }));
    bridge.setTimelineContextMarkers?.(markers);

    if (draft.mode === 'range') {
      const sMaster = Math.max(0, Math.min(29.4, Number(draft.startMasterSec) || 13.5));
      const eMaster = Math.max(sMaster + 0.5, Math.min(30, Number(draft.endMasterSec) || sMaster + 3.0));
      draft.startMasterSec = sMaster;
      draft.endMasterSec = eMaster;
      bridge.setTimelineFocusRange?.({
        key: 'step1-draft:range',
        startTime: formatSecMMSS(Math.max(0, sMaster - 2.6)),
        endTime: formatSecMMSS(Math.max(0.4, eMaster - 2.6)),
        startSec: sMaster - 2.6,
        endSec: eMaster - 2.6,
        startMasterSec: sMaster,
        endMasterSec: eMaster,
        cam: draft.cam,
      });
      if (jumpVideo) silentJumpVideoForReanalyse(draft.cam, sMaster);
    } else {
      bridge.setTimelineFocusRange?.(null);
      if (jumpVideo) silentJumpVideoForReanalyse(draft.cam, draft.masterSec);
    }
  };

  const syncReanalyseCueBadgeDom = (draft) => {
    if (!reanalyseSheetEl || !draft) return;
    const liveWrapEl = reanalyseSheetEl.querySelector('[data-ux-reanalyse-live-wrap]');
    if (!liveWrapEl) return;
    liveWrapEl.hidden = false;
    liveWrapEl.innerHTML = renderStep2ContextBadgeHtml(draft, { interactive: false, active: draft.mode !== 'none' });
  };

  const hideSpotlightLayer = () => {
    clearTimeout(reanalyseCloseTimer);
    reanalyseCloseTimer = 0;
    if (detailWorkspacesEl) delete detailWorkspacesEl.dataset.reanalyseOpen;
    bridge.setTimelineDraftMode?.(false);
    bridge.setTimelineFocusRange?.(null);
    bridge.setTimelineContextMarkers?.([]);
    const triggerBtn = getStep1RerunTriggerBtn();
    if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
    if (reanalyseLayerEl && !reanalyseLayerEl.hidden) {
      reanalyseLayerEl.dataset.open = 'false';
      const skipAnim = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.reducedMotion === 'true');
      if (skipAnim) {
        reanalyseLayerEl.hidden = true;
      } else {
        reanalyseCloseTimer = window.setTimeout(() => {
          reanalyseCloseTimer = 0;
          if (!isTimelineSpotlightOpen() && reanalyseLayerEl) {
            reanalyseLayerEl.hidden = true;
          }
        }, 190);
      }
    }
  };

  const closeStep1ReanalyseSheet = ({ discardDraft = false } = {}) => {
    if (store.step1ReanalyseDraft) {
      if (discardDraft) store.step1ReanalyseDraft = null;
      else store.step1ReanalyseDraft.open = false;
    }
    if (store.evidenceDraft) {
      store.evidenceDraft = null;
      const curCase = getCase(store.activeCaseId);
      if (curCase && store.activeStep === 2) renderVideoTimeline(curCase);
    }
    hideSpotlightLayer();
  };

  const normalizeContextItem = (source, fallbackId) => {
    const mode = source?.mode === 'range' || source?.mode === 'none' ? source.mode : 'moment';
    const cam = Math.max(1, Math.min(4, Number(source?.cam) || 1));
    const masterSec = Math.max(0, Math.min(30, Number(source?.masterSec ?? 15.0)));
    const startMasterSec = Math.max(0, Math.min(29.4, Number(source?.startMasterSec ?? Math.max(0, masterSec - 1.5))));
    const endMasterSec = Math.max(startMasterSec + 0.5, Math.min(30, Number(source?.endMasterSec ?? Math.min(30, startMasterSec + 3.0))));
    const item = {
      id: source?.id || fallbackId || `ctx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: String(source?.text || '').trim(),
      mode,
      cam,
      masterSec,
      startMasterSec,
      endMasterSec,
    };
    item.cueLabel = formatStep1ContextCue(item);
    return item;
  };

  const commitComposerContextToDraft = (c, draft) => {
    const cleanText = String(draft?.text || '').trim();
    if (!cleanText) return false;
    let savedId = null;
    if (draft.editingId) {
      const idx = draft.items.findIndex((x) => x.id === draft.editingId);
      if (idx >= 0) {
        draft.items[idx] = normalizeContextItem({ ...draft, id: draft.editingId, text: cleanText }, draft.editingId);
        savedId = draft.editingId;
      } else {
        const created = normalizeContextItem({ ...draft, text: cleanText });
        draft.items.push(created);
        savedId = created.id;
      }
      draft.editingId = null;
    } else {
      const created = normalizeContextItem({ ...draft, text: cleanText });
      draft.items.push(created);
      savedId = created.id;
    }
    draft.focusedItemId = savedId;
    draft.text = '';
    const ph = bridge.getVideoPlayheadState?.() || {};
    draft.masterSec = Number.isFinite(ph.masterSec) ? ph.masterSec : draft.masterSec;
    draft.startMasterSec = Math.max(0, Math.min(27.0, draft.masterSec - 1.5));
    draft.endMasterSec = Math.min(30, draft.startMasterSec + 3.0);
    return true;
  };

  const renderStep1ReanalyseSheet = (c) => {
    if (!reanalyseSheetEl || !c) return;
    const draft = store.step1ReanalyseDraft;
    if (!draft) return;

    const items = draft.items || [];
    const hasDraftText = Boolean(draft.text?.trim());
    const pendingCount = items.length + (draft.editingId ? 0 : (hasDraftText ? 1 : 0));

    reanalyseSheetEl.innerHTML = `
      <div class="ux-dialog__header">
        <div class="ux-dialog__title-wrap">
          <h3 class="ux-dialog__title">Re-analyse</h3>
        </div>
      </div>

      <div class="ux-dialog__body ux-reanalyse-sheet__body ds-scrollbar" data-ux-reanalyse-body>
        <form class="ux-reanalyse-composer" data-ux-reanalyse-form>
          <label class="ds-label" for="ux-reanalyse-input">Context</label>
          <div class="ux-reanalyse-composer-card">
            <textarea id="ux-reanalyse-input" class="ds-textarea ux-reanalyse-input" data-ux-reanalyse-input rows="2" placeholder="Describe what AI missed...">${esc(draft.text || '')}</textarea>
            <div class="ux-reanalyse-composer-card__foot">
              <div class="ux-reanalyse-composer-card__bar">
                <span class="ds-label">Evidence</span>
                <div class="ds-segmented ds-segmented--sm ux-reanalyse-mode" data-ds-segmented data-ux-reanalyse-mode role="radiogroup" aria-label="Timestamp attachment">
                  <div class="ds-segmented__thumb"></div>
                  <button type="button" role="radio" data-value="none" aria-checked="${draft.mode === 'none'}" aria-pressed="${draft.mode === 'none'}" data-state="${draft.mode === 'none' ? 'on' : 'off'}">None</button>
                  <button type="button" role="radio" data-value="moment" aria-checked="${draft.mode === 'moment'}" aria-pressed="${draft.mode === 'moment'}" data-state="${draft.mode === 'moment' ? 'on' : 'off'}">Moment</button>
                  <button type="button" role="radio" data-value="range" aria-checked="${draft.mode === 'range'}" aria-pressed="${draft.mode === 'range'}" data-state="${draft.mode === 'range' ? 'on' : 'off'}">Range</button>
                </div>
              </div>
              <div class="ux-reanalyse-composer-card__bar">
                <div class="ux-reanalyse-anchor-box__live" data-ux-reanalyse-live-wrap>
                  ${renderStep2ContextBadgeHtml(draft, { interactive: false, active: draft.mode !== 'none' })}
                </div>
                <div class="ux-reanalyse-composer__actions">
                  ${draft.editingId ? `<button type="button" class="ds-button ds-button--ghost ds-button--sm" data-ux-reanalyse-cancel-edit>Cancel</button>` : ''}
                  <button type="submit" class="ds-button ds-button--outline ds-button--sm" data-ux-reanalyse-add${hasDraftText ? '' : ' disabled'}>
                    <span>${draft.editingId ? 'Update' : 'Save'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div class="ux-reanalyse-added">
          <div class="ux-reanalyse-added__head">
            <span class="ds-label">Saved contexts</span>
            <span class="ds-badge ds-badge--pill ds-badge--default ux-num" data-ux-reanalyse-saved-count>${items.length}</span>
          </div>
          <div class="ux-reanalyse-added__list" data-ux-reanalyse-list>
            ${items.length ? items.map((item) => {
              const isEditing = draft.editingId === item.id;
              const isFocused = (draft.editingId || draft.focusedItemId) === item.id;
              return `
                <div class="ux-reanalyse-card" data-ux-reanalyse-item="${esc(item.id)}"${isEditing ? ' data-editing="true"' : ''}${isFocused ? ' data-active="true"' : ''}>
                  <div class="ux-reanalyse-card__head">
                    <p class="ux-reanalyse-card__text">${esc(item.text)}</p>
                    <div class="ux-reanalyse-card__actions">
                      <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" data-ux-reanalyse-edit="${esc(item.id)}" aria-label="Edit context" title="Edit">
                        ${ICON_EDIT_SM}
                      </button>
                      <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" data-ux-reanalyse-del="${esc(item.id)}" aria-label="Remove context" title="Remove">
                        ${ICON_TRASH_SM}
                      </button>
                    </div>
                  </div>
                  <div class="ux-reanalyse-card__meta">
                    ${renderStep2ContextBadgeHtml(item, { interactive: true, active: isFocused })}
                  </div>
                </div>
              `;
            }).join('') : '<div class="ux-reanalyse-empty">No saved contexts</div>'}
          </div>
        </div>
      </div>

      <div class="ux-dialog__footer">
        <button type="button" class="ds-button ds-button--secondary" data-ux-reanalyse-close>Cancel</button>
        <button type="button" class="ds-button ds-button--primary" data-ux-reanalyse-run>
          <span>${pendingCount > 0 ? `Re-analyse (${pendingCount})` : 'Re-analyse'}</span>
        </button>
      </div>
    `;

    const modeSeg = reanalyseSheetEl.querySelector('[data-ux-reanalyse-mode]');
    const textareaEl = reanalyseSheetEl.querySelector('[data-ux-reanalyse-input]');
    const addBtnEl = reanalyseSheetEl.querySelector('[data-ux-reanalyse-add]');
    const runBtnEl = reanalyseSheetEl.querySelector('[data-ux-reanalyse-run]');

    if (modeSeg) {
      requestAnimationFrame(() => syncSegmentedThumb(modeSeg));
      modeSeg.querySelectorAll('[role="radio"]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const nextMode = btn.dataset.value || 'moment';
          if (draft.mode === nextMode) return;
          draft.mode = nextMode;
          const ph = bridge.getVideoPlayheadState?.() || {};
          if (nextMode === 'moment') {
            draft.masterSec = Number.isFinite(ph.masterSec) ? ph.masterSec : draft.masterSec;
            draft.cam = Number(ph.activeCamId || draft.cam || 1);
          } else if (nextMode === 'range') {
            const center = Number.isFinite(ph.masterSec) ? ph.masterSec : draft.masterSec;
            draft.startMasterSec = Math.max(0, Math.min(27.0, center - 1.5));
            draft.endMasterSec = Math.min(30, draft.startMasterSec + 3.0);
            draft.cam = Number(ph.activeCamId || draft.cam || 1);
          }
          modeSeg.querySelectorAll('[role="radio"]').forEach((rb) => {
            const on = rb.dataset.value === nextMode;
            rb.setAttribute('aria-checked', String(on));
            rb.setAttribute('aria-pressed', String(on));
            rb.dataset.state = on ? 'on' : 'off';
          });
          syncSegmentedThumb(modeSeg);
          syncReanalyseCueBadgeDom(draft);
          syncReanalyseDraftToTimeline(draft, { jumpVideo: false });
          textareaEl?.focus({ preventScroll: true });
        });
      });
    }

    textareaEl?.addEventListener('input', () => {
      draft.text = textareaEl.value;
      const nonEmpty = Boolean(draft.text.trim());
      if (addBtnEl) addBtnEl.disabled = !nonEmpty;
      if (runBtnEl) {
        const countNow = draft.items.length + (draft.editingId ? 0 : (nonEmpty ? 1 : 0));
        const span = runBtnEl.querySelector('span');
        if (span) span.textContent = countNow > 0 ? `Re-analyse (${countNow})` : 'Re-analyse';
      }
    });

    const handleCommitDraft = () => {
      const wasEditing = Boolean(draft.editingId);
      if (!commitComposerContextToDraft(c, draft)) {
        textareaEl?.focus({ preventScroll: true });
        return;
      }
      syncReanalyseDraftToTimeline(draft, { jumpVideo: false });
      renderStep1ReanalyseSheet(c);
      requestAnimationFrame(() => {
        if (!wasEditing) {
          reanalyseSheetEl.querySelector('[data-ux-reanalyse-body]')?.scrollTo?.({ top: 99999 });
        }
        reanalyseSheetEl.querySelector('[data-ux-reanalyse-input]')?.focus({ preventScroll: true });
      });
    };

    textareaEl?.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        runBtnEl?.click();
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (draft.text?.trim()) handleCommitDraft();
      }
    });

    reanalyseSheetEl.querySelector('[data-ux-reanalyse-form]')?.addEventListener('submit', (e) => {
      e.preventDefault();
      handleCommitDraft();
    });

    reanalyseSheetEl.querySelectorAll('[data-ux-reanalyse-cue-jump]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.uxReanalyseCueJump;
        const item = draft.items.find((x) => x.id === id);
        if (!item || item.mode === 'none') return;
        draft.focusedItemId = item.id;
        if (item.mode === 'range') {
          silentJumpVideoForReanalyse(item.cam, item.startMasterSec);
        } else {
          silentJumpVideoForReanalyse(item.cam, item.masterSec);
        }
        syncReanalyseDraftToTimeline(draft, { jumpVideo: false });
        reanalyseSheetEl.querySelectorAll('[data-ux-reanalyse-item]').forEach((cardEl) => {
          cardEl.dataset.active = String(cardEl.dataset.uxReanalyseItem === id);
        });
        reanalyseSheetEl.querySelectorAll('[data-ux-reanalyse-cue-jump]').forEach((el) => {
          el.dataset.active = String(el.dataset.uxReanalyseCueJump === id);
        });
      });
    });

    reanalyseSheetEl.querySelectorAll('[data-ux-reanalyse-edit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.uxReanalyseEdit;
        const item = draft.items.find((x) => x.id === id);
        if (!item) return;
        draft.editingId = item.id;
        draft.focusedItemId = item.id;
        draft.text = item.text;
        draft.mode = item.mode;
        draft.cam = item.cam;
        draft.masterSec = item.masterSec;
        draft.startMasterSec = item.startMasterSec;
        draft.endMasterSec = item.endMasterSec;
        syncReanalyseDraftToTimeline(draft, { jumpVideo: item.mode !== 'none' });
        renderStep1ReanalyseSheet(c);
        requestAnimationFrame(() => {
          const inp = reanalyseSheetEl.querySelector('[data-ux-reanalyse-input]');
          if (inp) {
            inp.focus({ preventScroll: true });
            inp.setSelectionRange?.(inp.value.length, inp.value.length);
          }
        });
      });
    });

    reanalyseSheetEl.querySelectorAll('[data-ux-reanalyse-del]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.uxReanalyseDel;
        draft.items = draft.items.filter((x) => x.id !== id);
        if (draft.editingId === id) {
          draft.editingId = null;
          draft.text = '';
        }
        if (draft.focusedItemId === id) draft.focusedItemId = null;
        syncReanalyseDraftToTimeline(draft, { jumpVideo: false });
        renderStep1ReanalyseSheet(c);
      });
    });

    reanalyseSheetEl.querySelector('[data-ux-reanalyse-cancel-edit]')?.addEventListener('click', () => {
      draft.editingId = null;
      draft.text = '';
      syncReanalyseDraftToTimeline(draft, { jumpVideo: false });
      renderStep1ReanalyseSheet(c);
    });

    reanalyseSheetEl.querySelectorAll('[data-ux-reanalyse-close]').forEach((btn) => {
      btn.addEventListener('click', () => closeStep1ReanalyseSheet({ discardDraft: false }));
    });

    runBtnEl?.addEventListener('click', () => {
      if (draft.text?.trim()) commitComposerContextToDraft(c, draft);
      const finalContexts = (draft.items || []).map((item) => normalizeContextItem(item, item.id));
      closeStep1ReanalyseSheet({ discardDraft: true });
      rerunStep1(c, finalContexts);
    });
  };

    const openStep1ReanalyseSheet = (c) => {
    if (!c || c.isClosed || !reanalyseLayerEl || !reanalyseSheetEl) return;
    clearTimeout(reanalyseCloseTimer);
    reanalyseCloseTimer = 0;
    store.evidenceDraft = null;
    delete reanalyseSheetEl.dataset.sheetMode;
    bridge.setAgentPanelOpen?.(false);

    const ph = bridge.getVideoPlayheadState?.() || {};
    const curCam = Math.max(1, Math.min(4, Number(ph.activeCamId || videoCanvasEl?.dataset.activeCam || 1)));
    const curMaster = Number.isFinite(ph.masterSec) ? ph.masterSec : 15.0;

    if (!store.step1ReanalyseDraft || store.step1ReanalyseDraft.caseId !== c.id) {
      store.step1ReanalyseDraft = {
        caseId: c.id,
        open: true,
        items: (c.step1Contexts || []).map((item) => normalizeContextItem(item, item.id)),
        editingId: null,
        focusedItemId: null,
        text: '',
        mode: 'moment',
        cam: curCam,
        masterSec: curMaster,
        startMasterSec: Math.max(0, Math.min(27.0, curMaster - 1.5)),
        endMasterSec: Math.min(30, Math.max(0, Math.min(27.0, curMaster - 1.5)) + 3.0),
      };
    } else {
      store.step1ReanalyseDraft.open = true;
    }

    const triggerBtn = getStep1RerunTriggerBtn();
    if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'true');
    if (detailWorkspacesEl) detailWorkspacesEl.dataset.reanalyseOpen = 'true';

    renderStep1ReanalyseSheet(c);
    syncReanalyseDraftToTimeline(store.step1ReanalyseDraft, { jumpVideo: false });

    reanalyseLayerEl.hidden = false;
    syncReanalyseSheetPosition();
    requestAnimationFrame(() => {
      if (store.step1ReanalyseDraft?.open && reanalyseLayerEl) {
        syncReanalyseSheetPosition();
        reanalyseLayerEl.dataset.open = 'true';
        reanalyseSheetEl.querySelector('[data-ux-reanalyse-input]')?.focus({ preventScroll: true });
      }
    });
  };

  reanalyseScrimEl?.addEventListener('click', () => {
    if (isTimelineSpotlightOpen()) closeStep1ReanalyseSheet({ discardDraft: false });
  });

  window.addEventListener('resize', () => {
    if (isTimelineSpotlightOpen()) syncReanalyseSheetPosition();
  });

  videoPanelScrollEl?.addEventListener('scroll', () => {
    if (isTimelineSpotlightOpen()) syncReanalyseSheetPosition();
  }, { passive: true });

  document.addEventListener('ux-agent-panel-opened', () => {
    if (isTimelineSpotlightOpen()) closeStep1ReanalyseSheet({ discardDraft: false });
  });

  document.addEventListener('ux-camera-change', (e) => {
    if (silentReanalyseVideoSync) return;
    const step1Draft = store.step1ReanalyseDraft;
    if (step1Draft?.open && store.activeStep === 1) {
      const nextCam = Math.max(1, Math.min(4, Number(e.detail?.camId) || step1Draft.cam));
      if (step1Draft.cam === nextCam) return;
      step1Draft.cam = nextCam;
      syncReanalyseCueBadgeDom(step1Draft);
      return;
    }
    const evDraft = store.evidenceDraft;
    if (evDraft?.open && store.activeStep === 2) {
      const nextCam = Math.max(1, Math.min(4, Number(e.detail?.camId) || evDraft.cam));
      if (evDraft.cam === nextCam) return;
      evDraft.cam = nextCam;
      syncStep2EvidenceBadgeDom(evDraft);
    }
  });

  document.addEventListener('ux-timeline-context-marker-click', (e) => {
    if (store.activeStep === 2 && store.evidenceDraft?.open && store.evidenceDraft.type !== 'range') {
      const evDraft = store.evidenceDraft;
      const item = (evDraft.momentItems || []).find((x) => String(x.id) === String(e.detail?.id));
      if (!item) return;
      evDraft.activeMomentId = item.id;
      evDraft.cam = item.cam;
      evDraft.masterSec = item.masterSec;
      silentJumpVideoForReanalyse(item.cam, item.masterSec);
      syncStep2EvidenceBadgeDom(evDraft);
      syncStep2EvidenceDraftToTimeline(evDraft, { jumpVideo: false });
      return;
    }
    const draft = store.step1ReanalyseDraft;
    if (!draft?.open || store.activeStep !== 1) return;
    const item = draft.items.find((x) => x.id === e.detail?.id);
    if (!item) return;
    draft.focusedItemId = item.id;
    if (item.mode === 'range') {
      silentJumpVideoForReanalyse(item.cam, item.startMasterSec);
    } else if (item.mode === 'moment') {
      silentJumpVideoForReanalyse(item.cam, item.masterSec);
    }
    syncReanalyseDraftToTimeline(draft, { jumpVideo: false });
    reanalyseSheetEl?.querySelectorAll('[data-ux-reanalyse-item]').forEach((cardEl) => {
      cardEl.dataset.active = String(cardEl.dataset.uxReanalyseItem === item.id);
    });
    reanalyseSheetEl?.querySelectorAll('[data-ux-reanalyse-cue-jump]').forEach((el) => {
      el.dataset.active = String(el.dataset.uxReanalyseCueJump === item.id);
    });
    reanalyseSheetEl?.querySelector(`[data-ux-reanalyse-item="${item.id}"]`)?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  });

  const rerunStep1 = (c, contextsInput = []) => {
    if (!c || c.isClosed) return;
    let normalizedContexts = [];
    if (Array.isArray(contextsInput)) {
      normalizedContexts = contextsInput
        .map((item) => normalizeContextItem(item, item?.id))
        .filter((item) => item.text);
    } else if (typeof contextsInput === 'string' && contextsInput.trim()) {
      normalizedContexts = [normalizeContextItem({ text: contextsInput.trim(), mode: 'none', cam: 1 })];
    }
    c.step1Contexts = normalizedContexts;
    if (normalizedContexts.length) {
      c.rerunGuidance = {
        ...(c.rerunGuidance || {}),
        1: normalizedContexts.map((x) => (x.cueLabel ? `${x.cueLabel}: ${x.text}` : x.text)).join(' | '),
      };
      c.guidanceBoostByStep = {
        ...(c.guidanceBoostByStep || {}),
        1: normalizedContexts.reduce((sum, item) => sum + (item.mode === 'none' ? 2 : 4), 0),
      };
    } else {
      if (c.rerunGuidance) delete c.rerunGuidance[1];
      if (c.guidanceBoostByStep) delete c.guidanceBoostByStep[1];
    }
    hideCondThumbTip();
    c.analysisDone = false;
    c.lowMatchSimulation = false;
    if (c.stage === 'undetermined') c.stage = 'pending_chart';
    delete store.expandedScenarioByCase[c.id];
    store.activeConditionTarget = null;
    clearTimelineRangeFocus(c, false);
    renderStageOverlay(null);
    bridge.setVideoPlaying(false);
    lastCam1RefSec = 0;
    bridge.setScrubberValue(0);
    renderVideoTimeline(c);
    if (analysingEl) delete analysingEl.dataset.renderedKey;
    logActivity(
      c.id,
      'ANALYSIS',
      normalizedContexts.length
        ? `Re-ran Step 1 analysis (${normalizedContexts.length} context${normalizedContexts.length === 1 ? '' : 's'})`
        : 'Re-ran 4-cam AI reasoning pipeline',
      'Adjuster'
    );
    renderBanners(c);
    renderCaseQueueRows();
    renderStep1(c, true);
  };

  /** Renders KNIA applicability prose with inline clickable frame-linked condition tags. */
  const renderBasisProseHtml = (ch, basis, activeCondKey) => {
    if (!basis.length) return esc(ch.criteria?.join(', ') || ch.title || '');
    const byId = new Map(basis.map((cond) => [cond.id, cond]));
    const template = ch.kniaProse || basis.map((cond) => `{${cond.id}}`).join(' · ');
    const tokenRe = /\{([^}]+)\}/g;
    let html = '';
    let lastIndex = 0;
    let match;
    while ((match = tokenRe.exec(template)) !== null) {
      if (match.index > lastIndex) {
        html += esc(template.slice(lastIndex, match.index));
      }
      const cond = byId.get(match[1]);
      if (cond) {
        const condKey = `${ch.code}:${cond.id}`;
        const isActiveCond = activeCondKey === condKey;
        const cleanTime = String(cond.time || '').replace(/^00:/, '');
        html += `<button type="button" class="ux-as-cond-hl" data-ux-cond-key="${esc(condKey)}" data-ux-cond-chart="${esc(ch.code)}" data-ux-cond-id="${esc(cond.id)}" data-ux-cond-cam="${esc(cond.cam)}" data-ux-cond-time="${esc(cleanTime)}" data-active="${isActiveCond}" aria-label="Jump to ${esc(getCamShortName(cond.cam))} at 0:${esc(cleanTime)}">${esc(cond.highlight)}</button>`;
      } else {
        html += esc(match[0]);
      }
      lastIndex = tokenRe.lastIndex;
    }
    if (lastIndex < template.length) {
      html += esc(template.slice(lastIndex));
    }
    return html;
  };

  const renderScenarioDetailHtml = (ch, isSelected = false, isClosed = false, isExpanded = false) => {
    const basis = ch.kniaBasis || [];
    const activeCondKey = store.activeConditionTarget?.key || '';
    const label = scenarioLabel(ch);
    return `
      <div class="ux-as-detail" role="region" aria-label="${esc(label)} details">
        <div class="ux-as-hero">
          <div class="ux-as-sim">
            <div class="ux-as-sim__head">
              <span class="ux-as-detail__kicker">Simulation</span>
              <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" data-ux-replay-sim="${esc(ch.code)}" aria-label="Replay simulation">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.2716 2 18.1763 3.57111 20.0007 6V2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div class="ux-as-sim__stage" data-ux-sim-stage="${esc(ch.code)}">
              ${buildScenarioSimulationSvg(ch, { animated: isExpanded })}
            </div>
          </div>

          <div class="ux-as-ratio">
            <div class="ux-as-ratio__summary">
              <div class="ux-as-ratio__head">
                <span class="ux-as-detail__kicker">Base ratio</span>
                <span class="ux-as-ratio__big" aria-label="${esc(ch.baseRatio)}">
                  <span class="ux-as-ratio__val ux-as-ratio__val--a">${esc(ch.insuredFault)}</span>
                  <span class="ux-as-ratio__sep" aria-hidden="true">:</span>
                  <span class="ux-as-ratio__val ux-as-ratio__val--b">${esc(ch.counterpartyFault)}</span>
                </span>
              </div>
              ${renderSplitBarHtml({ cls: 'ux-as-split-track' })}
              <div class="ux-as-parties">
                <div class="ux-as-party ux-as-party--a">
                  <span class="ux-as-party__id"><span class="ux-as-dot ux-as-dot--a" aria-hidden="true"></span><span>A</span></span>
                  <span class="ux-as-party__role">${esc(ch.partyARole || 'Insured')}</span>
                  <span class="ux-as-party__pct">${esc(ch.insuredFault)}%</span>
                </div>
                <div class="ux-as-party ux-as-party--b">
                  <span class="ux-as-party__id"><span class="ux-as-dot ux-as-dot--b" aria-hidden="true"></span><span>B</span></span>
                  <span class="ux-as-party__role">${esc(ch.partyBRole || 'Counterparty')}</span>
                  <span class="ux-as-party__pct">${esc(ch.counterpartyFault)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="ux-as-basis">
            <span class="ux-as-detail__kicker">Applicability criteria</span>
            <p class="ux-as-basis__prose">${renderBasisProseHtml(ch, basis, activeCondKey)}</p>
          </div>
        </div>
      </div>
    `;
  };

  let step1AccordionHeightTimer = 0;

  const setScenarioItemExpanded = (c, itemEl, nextOpen) => {
    if (!itemEl) return;
    const code = itemEl.dataset.uxScenarioCode;
    const expandedSet = getCaseSet(store.expandedScenarioByCase, c.id, getTopConfidenceChartCode(c));
    if (code) {
      if (nextOpen) expandedSet.add(code);
      else expandedSet.delete(code);
    }
    itemEl.dataset.expanded = String(nextOpen);
    itemEl.querySelector('[data-ux-toggle-as]')?.setAttribute('aria-expanded', String(nextOpen));
    const collapseEl = itemEl.querySelector(':scope > .ux-collapse');
    if (collapseEl) {
      collapseEl.dataset.open = String(nextOpen);
      collapseEl.inert = !nextOpen;
    }
    const simSvg = itemEl.querySelector('[data-ux-sim-stage] svg');
    if (simSvg) {
      if (nextOpen) playScenarioSimulation(simSvg, { force: false });
      else stopScenarioSimulation(simSvg);
    }
  };

  const activateScenarioAccordion = (c, code, { allowCollapse = true } = {}) => {
    if (!c || !code) return;
    const chartListEl = step1ChartsEl?.querySelector('.ux-chart-list');
    const targetItemEl = chartListEl?.querySelector(`.ux-scenario-item[data-ux-scenario-code="${CSS.escape(code)}"]`);
    if (!chartListEl || !targetItemEl) {
      handleSelectChart(c, code, { forceExpand: true, goToStep2: false });
      return;
    }

    const scrollEl = document.querySelector('.ds-detail-workspace--primary');
    const prevListH = chartListEl.offsetHeight;
    const wasExpanded = targetItemEl.dataset.expanded === 'true';
    const otherOpenEl = Array.from(chartListEl.querySelectorAll('.ux-scenario-item[data-expanded="true"]'))
      .find((el) => el !== targetItemEl);
    const hasCollapsingAbove = Boolean(
      otherOpenEl && (otherOpenEl.compareDocumentPosition(targetItemEl) & Node.DOCUMENT_POSITION_FOLLOWING)
    );

    const clearAccordionAnchorStyles = () => {
      if (chartListEl.isConnected) {
        chartListEl.style.minHeight = '';
        chartListEl.style.overflowAnchor = '';
      }
      if (scrollEl?.isConnected) scrollEl.style.overflowAnchor = '';
      chartListEl.querySelectorAll('.ux-scenario-item').forEach((el) => {
        el.style.overflowAnchor = '';
      });
    };

    if (prevListH > 0) {
      clearTimeout(step1AccordionHeightTimer);
      chartListEl.style.minHeight = `${prevListH}px`;
    }

    if (wasExpanded && allowCollapse) {
      setScenarioItemExpanded(c, targetItemEl, false);
      step1AccordionHeightTimer = window.setTimeout(clearAccordionAnchorStyles, 250);
      return;
    }

    if (scrollEl && hasCollapsingAbove && scrollEl.scrollTop > 0) {
      scrollEl.style.overflowAnchor = 'auto';
      chartListEl.style.overflowAnchor = 'auto';
      if (otherOpenEl) otherOpenEl.style.overflowAnchor = 'none';
      targetItemEl.style.overflowAnchor = 'auto';
    }

    const expandedSet = getCaseSet(store.expandedScenarioByCase, c.id, getTopConfidenceChartCode(c));
    expandedSet.clear();
    expandedSet.add(code);

    chartListEl.querySelectorAll('.ux-scenario-item').forEach((itemEl) => {
      setScenarioItemExpanded(c, itemEl, itemEl.dataset.uxScenarioCode === code);
    });

    if (!c.isClosed) {
      handleSelectChart(c, code, { preserveExpand: true, goToStep2: false });
    }

    step1AccordionHeightTimer = window.setTimeout(clearAccordionAnchorStyles, 250);
  };

  const renderStep1Charts = (c, animateReveal = false) => {
    if (!step1ChartsEl) return;
    if (c.stage === 'undetermined' && !c.lowMatchSimulation) {
      step1ChartsEl.hidden = false;
      step1ChartsEl.innerHTML = `
        <div class="ux-card ux-card--muted ux-reveal">
          <div class="ux-section-head">
            <span class="ux-title">${esc(c.haltStage || 'Unclear lane marking')}</span>
            <span class="ds-badge ds-badge--pill ds-badge--red">Paused</span>
          </div>
          <p class="ux-subtitle">${esc(c.haltReason || 'Confirm impact timestamp to resume.')}</p>
          <form class="ux-form" data-ux-recovery-form>
            <div class="ux-grid-2">
              <div class="ux-field">
                <label class="ds-label" for="ux-recovery-ts">Impact time</label>
                <input id="ux-recovery-ts" class="ds-input ds-input--sm" type="text" value="00:12.4" required />
              </div>
              <div class="ux-field">
                <label class="ds-label" for="ux-recovery-note">Note</label>
                <input id="ux-recovery-note" class="ds-input ds-input--sm" type="text" value="Red clearance entry on Cam 4" required />
              </div>
            </div>
            <div class="ux-toolbar-group">
              <button type="submit" class="ds-button ds-button--primary">Resume</button>
              <button type="button" class="ds-button ds-button--secondary" data-ux-open-library ${c.isClosed ? 'disabled' : ''}>Add scenario</button>
            </div>
          </form>
        </div>
      `;
      step1ChartsEl.querySelector('[data-ux-open-library]')?.addEventListener('click', () => openKniaLibraryModal(c));
      step1ChartsEl.querySelector('[data-ux-recovery-form]')?.addEventListener('submit', (e) => {
        e.preventDefault();
        c.stage = 'pending_chart';
        c.selectedChart = c.selectedChart || 'KNIA-205';
        c.analysisDone = false;
        if (analysingEl) delete analysingEl.dataset.renderedKey;
        logActivity(c.id, 'ANALYSIS', 'Resolved halt using timestamp 00:12.4', 'Adjuster');
        renderVideoTimeline(c);
        renderBanners(c);
        renderCaseQueueRows();
        renderStep1(c, true);
      });
      return;
    }

    const candidates = getChartsForCase(c);
    const selectedObj = KNIA_CHART_CATALOG.find((ch) => ch.code === c.selectedChart) || null;
    const defaultExpandCode = getTopConfidenceChartCode(c, candidates);
    const expandedSet = getCaseSet(store.expandedScenarioByCase, c.id, defaultExpandCode);
    if (expandedSet.size > 1) {
      const keepCode = (c.selectedChart && expandedSet.has(c.selectedChart))
        ? c.selectedChart
        : (expandedSet.has(defaultExpandCode) ? defaultExpandCode : expandedSet.values().next().value);
      expandedSet.clear();
      if (keepCode) expandedSet.add(keepCode);
    }

    step1ChartsEl.hidden = false;
    step1ChartsEl.innerHTML = `
      <div class="ux-section ${animateReveal ? (candidates.length > 0 ? 'ux-reveal-cards' : 'ux-reveal') : ''}">
        <section class="ux-info-canvas" aria-label="Matched accident scenarios">
          ${candidates.length === 0 ? `
            <div class="ds-callout ds-callout--danger ux-callout" role="alert">
              <span class="ds-callout__icon" aria-hidden="true">${ICON_ALERT_CIRCLE}</span>
              <div class="ds-callout__content">
                <span class="ds-callout__title">No match &ge;20%</span>
              </div>
              <button type="button" class="ds-button ds-button--primary" data-ux-open-library ${c.isClosed ? 'disabled' : ''}>Add scenario</button>
            </div>
          ` : `
            <div class="ux-canvas-head">
              <div class="ux-canvas-head__title-group">
                <h3 class="ux-canvas-head__title">Matched scenarios</h3>
                <span class="ds-badge ds-badge--pill ds-badge--default ux-num">${candidates.length}</span>
              </div>
              <div class="ux-toolbar-group">
                <button type="button" class="ds-button ds-button--ghost" data-ux-open-compare>Compare</button>
                <button type="button" class="ds-button ds-button--secondary" data-ux-open-library ${c.isClosed ? 'disabled' : ''}>
                  ${ICON_PLUS}
                  <span>Add scenario</span>
                </button>
              </div>
            </div>
            <div class="ux-chart-list ${animateReveal ? 'ux-chart-list--animate' : ''}" aria-label="Matched accident scenarios" data-has-selection="${Boolean(selectedObj)}">
              ${candidates.map((ch) => {
                const tier = fitTier(ch.fit);
                const active = Boolean(selectedObj && selectedObj.code === ch.code);
                const isExpanded = expandedSet.has(ch.code);
                const label = scenarioLabel(ch);
                return `
                  <div class="ux-scenario-item" data-ux-scenario-code="${esc(ch.code)}" data-selected="${active}" data-expanded="${isExpanded}">
                    <div class="ux-scenario-row">
                      <label class="ds-radio ux-scenario-row__radio">
                        <input type="radio" name="ux-as-radio-${esc(c.id)}" value="${esc(ch.code)}" data-ux-select-as="${esc(ch.code)}" ${active ? 'checked' : ''} ${c.isClosed ? 'disabled' : ''} aria-label="Select ${esc(label)}: ${esc(ch.title)}" />
                        <span class="ds-radio__control" aria-hidden="true"><span class="ds-radio__dot"></span></span>
                      </label>
                      <button type="button" class="ux-chart-card" data-ux-toggle-as="${esc(ch.code)}" aria-expanded="${isExpanded}" data-selected="${active}" data-fit="${esc(ch.fit)}" data-our="${esc(ch.insuredFault)}" data-opp="${esc(ch.counterpartyFault)}">
                        <div class="ux-chart-card__info">
                          <span class="ux-chart-card__title">${esc(ch.title)}</span>
                          <span class="ux-chart-card__sub">
                            <span class="ux-chart-card__code">${esc(label)}</span>
                            <span class="ux-chart-card__ratio ux-num"><span class="ux-chart-card__sep" aria-hidden="true">·</span><span>${esc(ch.baseRatio)}</span></span>
                          </span>
                        </div>
                        <div class="ux-chart-card__metrics">
                          ${ch.manual ? `<span class="ds-badge ds-badge--pill ds-badge--neutral">Manual</span>` : `<span class="ux-metric-meter">${renderRingMeterHtml(ch.fit, { tone: ch.fit >= 70 ? 'success' : ch.fit >= 40 ? 'warning' : 'danger', size: 'sm' })}<span class="ux-metric-meter__val ux-num">${esc(ch.fit)}%</span></span>`}
                          <svg class="ux-chart-card__chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M6 8.99993L12 14.9999L18 8.99988" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="16"/>
                          </svg>
                        </div>
                      </button>
                    </div>
                    <div class="ux-collapse" data-open="${isExpanded}" ${isExpanded ? '' : 'inert'}>
                      <div class="ux-collapse__inner">
                        ${renderScenarioDetailHtml(ch, active, c.isClosed, isExpanded)}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </section>
      </div>
    `;

    step1ChartsEl.querySelectorAll('.ux-scenario-item').forEach((itemEl) => {
      const card = itemEl.querySelector('.ux-chart-card');
      if (!card) return;
      const our = clampRatioUnit(card.dataset.our || '20');
      itemEl.querySelector('.ux-as-split-track')?.style.setProperty('--ratio-a', String(our));
      card.addEventListener('click', () => {
        activateScenarioAccordion(c, itemEl.dataset.uxScenarioCode, { allowCollapse: true });
      });
    });

    step1ChartsEl.querySelectorAll('[data-ux-select-as]').forEach((inp) => {
      inp.addEventListener('change', () => {
        if (inp.checked) {
          activateScenarioAccordion(c, inp.dataset.uxSelectAs, { allowCollapse: false });
        }
      });
    });

    mountScenarioSimulations(step1ChartsEl);

    step1ChartsEl.querySelectorAll('[data-ux-replay-sim]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.uxReplaySim;
        const svg = step1ChartsEl.querySelector(`[data-ux-sim-stage="${code}"] svg`);
        if (svg) playScenarioSimulation(svg, { force: true });
      });
    });

    step1ChartsEl.querySelectorAll('[data-ux-sim-stage]').forEach((stageEl) => {
      stageEl.addEventListener('click', () => {
        const svg = stageEl.querySelector('svg');
        if (svg) playScenarioSimulation(svg, { force: true });
      });
    });

    step1ChartsEl.querySelectorAll('[data-ux-cond-id]').forEach((btn) => {
      btn.addEventListener('pointerenter', () => showCondThumbTip(btn));
      btn.addEventListener('pointerleave', hideCondThumbTip);
      btn.addEventListener('focusin', () => showCondThumbTip(btn));
      btn.addEventListener('focusout', hideCondThumbTip);
      btn.addEventListener('click', () => {
        hideCondThumbTip();
        const ch = KNIA_CHART_CATALOG.find((x) => x.code === btn.dataset.uxCondChart);
        const cond = ch?.kniaBasis?.find((x) => x.id === btn.dataset.uxCondId);
        if (!ch || !cond) return;
        jumpToScenarioCondition(c, ch, cond);
        step1ChartsEl.querySelectorAll('[data-ux-cond-key]').forEach((el) => {
          el.dataset.active = String(el === btn);
        });
      });
    });

    step1ChartsEl.querySelector('[data-ux-open-compare]')?.addEventListener('click', () => openChartCompareModal(c));
    step1ChartsEl.querySelectorAll('[data-ux-open-library]').forEach((b) => b.addEventListener('click', () => openKniaLibraryModal(c)));
  };

  const renderStep1 = (c, forceRun = false) => {
    if (c.stage === 'undetermined' && !c.lowMatchSimulation) {
      runningStepState[1] = false;
      renderVideoTimeline(c);
      if (step1WrapEl) step1WrapEl.hidden = true;
      bridge.stopCaseAnalysis();
      renderStep1Charts(c, false);
      renderFloatBar(c);
      return;
    }

    if (step1WrapEl) step1WrapEl.hidden = false;

    const ctxList = Array.isArray(c.step1Contexts) ? c.step1Contexts : [];
    const step1DoneLabel = ctxList.length
      ? `4 keyframes · ${ctxList.length} context${ctxList.length === 1 ? '' : 's'}`
      : '4 keyframes';

    if (!c.analysisDone || forceRun) {
      const targetKey = `${c.id}:live:${forceRun ? Date.now() : 'init'}`;
      if (analysingEl?.dataset.renderedKey === targetKey && !forceRun) return;
      if (analysingEl) analysingEl.dataset.renderedKey = targetKey;
      if (step1ChartsEl) {
        step1ChartsEl.innerHTML = '';
        step1ChartsEl.hidden = true;
      }
      runningStepState[1] = true;
      renderVideoTimeline(c);
      renderFloatBar(c);
      bridge.startCaseAnalysis(c.id, {
        instantCollapsed: false,
        doneGroupLabel: step1DoneLabel,
        guidance: c.rerunGuidance?.[1] || '',
        contexts: ctxList,
        onRerun: () => {
          if (isStep1ReanalyseOpen()) closeStep1ReanalyseSheet({ discardDraft: false });
          else openStep1ReanalyseSheet(c);
        },
        rerunDisabled: Boolean(c.isClosed),
        onComplete: () => {
          runningStepState[1] = false;
          c.analysisDone = true;
          if (c.stage === 'analyzing' || c.stage === 'pending_analysis') {
            c.stage = 'pending_chart';
          }
          if (analysingEl) analysingEl.dataset.renderedKey = `${c.id}:done`;
          lastCam1RefSec = 12.4;
          bridge.setScrubberValue(12.4);
          renderVideoTimeline(c);
          renderBanners(c);
          syncStepperUI(c);
          renderCaseQueueRows();
          renderStep1Charts(c, true);
          renderFloatBar(c);
        },
      });
    } else {
      runningStepState[1] = false;
      renderVideoTimeline(c);
      const doneKey = `${c.id}:done`;
      if (analysingEl && analysingEl.dataset.renderedKey !== doneKey) {
        analysingEl.dataset.renderedKey = doneKey;
        bridge.startCaseAnalysis(c.id, {
          instantCollapsed: true,
          doneGroupLabel: step1DoneLabel,
          guidance: c.rerunGuidance?.[1] || '',
          contexts: ctxList,
          onRerun: () => {
            if (isStep1ReanalyseOpen()) closeStep1ReanalyseSheet({ discardDraft: false });
            else openStep1ReanalyseSheet(c);
          },
          rerunDisabled: Boolean(c.isClosed),
        });
      }
      renderStep1Charts(c, false);
      renderFloatBar(c);
    }
  };

  const handleSelectChart = (c, nextCode, opts = {}) => {
    if (!nextCode) return;
    const ch = KNIA_CHART_CATALOG.find((x) => x.code === nextCode);
    if (!ch) return;
    const expandedSet = getCaseSet(store.expandedScenarioByCase, c.id, getTopConfidenceChartCode(c));
    if (!opts.preserveExpand) {
      if (opts.forceExpand) {
        expandedSet.add(ch.code);
      } else if (expandedSet.has(ch.code)) {
        expandedSet.delete(ch.code);
      } else {
        expandedSet.add(ch.code);
      }
    }

    if (!c.isClosed && c.selectedChart !== ch.code) {
      c.selectedChart = ch.code;
      c.baseRatio = ch.baseRatio;
      c.baseInsuredPct = ch.insuredFault;
      c.baseOpponentPct = ch.counterpartyFault;
      c.evidenceAnalysedChart = null;
      c.step3AnalysedKey = null;
      delete store.expandedRefByCase[c.id];
      delete store.expandedModByCase[c.id];
      if (step2AnalysingEl) delete step2AnalysingEl.dataset.renderedKey;
      if (step3AnalysingEl) delete step3AnalysingEl.dataset.renderedKey;
      clearTimelineRangeFocus(c, true);
      if (c.stage === 'pending_chart' || c.stage === 'analyzing') c.stage = 'pending_report';
      logActivity(c.id, 'ANALYSIS', `Selected ${scenarioLabel(ch)} (${ch.baseRatio})`, 'Adjuster');
      renderCaseQueueRows();
      syncStepperUI(c);
    }
    if (opts.goToStep2) {
      selectStep(2);
      return;
    }

    const chartListEl = step1ChartsEl?.querySelector('.ux-chart-list');
    const targetItemEl = chartListEl?.querySelector(`.ux-scenario-item[data-ux-scenario-code="${CSS.escape(ch.code)}"]`);
    if (chartListEl && targetItemEl) {
      chartListEl.dataset.hasSelection = String(Boolean(c.selectedChart));
      chartListEl.querySelectorAll('.ux-scenario-item').forEach((itemEl) => {
        const itemCode = itemEl.dataset.uxScenarioCode;
        const isSel = itemCode === c.selectedChart;
        const itemObj = KNIA_CHART_CATALOG.find((x) => x.code === itemCode);
        const itemLabel = itemObj ? scenarioLabel(itemObj) : itemCode;
        itemEl.dataset.selected = String(isSel);
        const rowBtn = itemEl.querySelector('.ux-chart-card');
        if (rowBtn) rowBtn.dataset.selected = String(isSel);
        const codeEl = itemEl.querySelector('.ux-chart-card__code');
        if (codeEl) codeEl.textContent = itemLabel;
        const radioEl = itemEl.querySelector('[data-ux-select-as]');
        if (radioEl) radioEl.checked = isSel;
      });
      if (opts.forceExpand) setScenarioItemExpanded(c, targetItemEl, true);
      renderFloatBar(c);
      return;
    }

    renderStep1Charts(c, false);
    renderFloatBar(c);
  };

  // ── Step 2: AI Supporting Evidence Reasoning & Frame/Range Citations ──
  const formatEvidenceCue = (ev) => {
    if (!ev) return '0:12.4';
    if (ev.type === 'range') {
      const s = String(ev.startTime || '00:10.0').replace(/^00:/, '');
      const e = String(ev.endTime || '00:12.0').replace(/^00:/, '');
      return `0:${s}–0:${e}`;
    }
    return `0:${String(ev.time || '00:12.4').replace(/^00:/, '')}`;
  };

  const toStepOutputItems = (ev) => (
    ev.type === 'range' && Array.isArray(ev.keyframes) && ev.keyframes.length
      ? ev.keyframes.map((kf) => ({
          lead: `0:${String(kf.time || '').replace(/^00:/, '')}`,
          title: `${kf.label} · ${kf.hud}`,
          tag: `Cam ${kf.cam}`,
        }))
      : [{ lead: formatEvidenceCue(ev), title: ev.supportText, tag: `Cam ${ev.cam}` }]
  );

  const buildStep2AnalysisRecord = (c, chart) => {
    const label = scenarioLabel(chart);
    const evList = getEvidenceList(c, chart);
    const guidance = String(c?.rerunGuidance?.[2] || '').trim();
    const ev0 = evList[0] || { title: 'Approach check', supportText: chart.title, conf: 92, cam: 1, type: 'keyframe', time: '00:10.4' };
    const ev1 = evList[1] || ev0;
    const ev2 = evList[2] || ev1;
    const avgConf = evList.length
      ? Math.round(evList.reduce((sum, item) => sum + (item.conf || 90), 0) / evList.length)
      : 92;

    return {
      caseId: c.id,
      scenario: chart.title,
      guidance,
      doneGroupLabel: `Corroborated ${evList.length} proof items · ${label}`,
      runningPrefix: 'Corroborating proof step',
      liveAnnouncement: `${label} supporting proof corroborated`,
      steps: [
        {
          id: 's2-entry-check',
          tool: 'frame-detection',
          title: `Verified ${ev0.title} (${formatEvidenceCue(ev0)})`,
          runningTitle: `Checking proof for ${ev0.title.toLowerCase()}`,
          durationMs: 2200,
          summary: `${ev0.conf}% conf`,
          thinkingSteps: [
            guidance
              ? `Re-checking Cam ${ev0.cam} (${formatEvidenceCue(ev0)}) against ${label} with adjuster context "${guidance}"...`
              : `Inspecting Cam ${ev0.cam} to corroborate ${label} (${chart.category}) at ${formatEvidenceCue(ev0)}...`,
            `${ev0.supportText} Proof confidence verified at ${ev0.conf}%.`,
          ],
          input: {
            Scenario: `${label} (${chart.baseRatio})`,
            Proof: ev0.title,
            Source: `Cam ${ev0.cam} · ${formatEvidenceCue(ev0)}`,
            ...(guidance ? { Guidance: guidance } : {}),
          },
          output: {
            type: 'list',
            items: toStepOutputItems(ev0),
          },
        },
        {
          id: 's2-conflict-window',
          tool: 'kinematics-eval',
          title: `Reinforced ${ev1.title} (${formatEvidenceCue(ev1)})`,
          runningTitle: `Corroborating ${ev1.title.toLowerCase()}`,
          durationMs: 2400,
          summary: `${ev1.conf}% conf`,
          thinkingSteps: [
            `Cross-checking trajectory continuity across Cam ${ev1.cam} (${formatEvidenceCue(ev1)}) for ${chart.partyARole} vs ${chart.partyBRole}...`,
            `${ev1.supportText} Finding reinforced at ${ev1.conf}% confidence.`,
          ],
          input: {
            Target: ev1.title,
            Window: formatEvidenceCue(ev1),
            Camera: `Cam ${ev1.cam}`,
          },
          output: {
            type: 'list',
            items: toStepOutputItems(ev1),
          },
        },
        {
          id: 's2-impact-corroboration',
          tool: 'knia-engine',
          title: `Strengthened ${label} fault finding (${chart.baseRatio})`,
          runningTitle: `Consolidating ${label} proof & legal precedents`,
          durationMs: 2200,
          summary: `${avgConf}% avg`,
          thinkingSteps: [
            `Aligning ${evList.length || 3} proof cues, matching cases, and rulings with ${label} (${chart.baseRatio})...`,
            `${ev2.supportText} Corroboration package ready (${avgConf}% mean confidence).`,
          ],
          input: {
            Scenario: label,
            'Base ratio': chart.baseRatio,
            Proof: `${evList.length} cues verified`,
            ...(guidance ? { Guidance: guidance } : {}),
          },
          output: {
            type: 'table',
            columns: ['Proof item', 'Source', 'Confidence'],
            rows: evList.map((item) => [item.title, `${formatEvidenceCue(item)} · Cam ${item.cam}`, `${item.conf}%`]),
          },
        },
      ],
    };
  };

  const getEvidenceList = (c, chart) => {
    const overrides = c?.evidenceOverridesByChart?.[chart?.code] || {};
    const boost = Math.min(6, Math.max(0, Number(c?.guidanceBoostByStep?.[2]) || 0));
    const applyBoost = (ev) => {
      const merged = overrides[ev.id] ? { ...ev, ...overrides[ev.id] } : { ...ev };
      if (!merged.manual && typeof merged.conf === 'number' && boost > 0) {
        merged.conf = Math.min(99, merged.conf + boost);
      }
      return merged;
    };
    const templateItems = (chart?.evidenceTemplate || []).map(applyBoost);
    const customItems = (c?.customEvidenceByChart?.[chart?.code] || []).map((ev) => ({ ...ev }));
    return [...templateItems, ...customItems];
  };

  const isEvidenceSelected = (c, chartCode, evId) => {
    const key = `${chartCode}:${evId}`;
    return c?.selectedEvidenceMap?.[key] !== false;
  };

  const getSelectedEvidenceList = (c, chart) =>
    getEvidenceList(c, chart).filter((ev, idx) => isEvidenceSelected(c, chart.code, ev.id || idx));

  const renderRefSectionHtml = (c, chart, sectionTitle, items, kindPrefix) => {
    if (!items.length) return '';
    const expandedSet = getCaseSet(store.expandedRefByCase, c.id);
    return `
      <div class="ux-ref-group">
        <div class="ux-section-head">
          <h3 class="ux-title">${esc(sectionTitle)}</h3>
        </div>
        <div class="ux-ref-list">
          ${items.map((ref, idx) => {
            const refKey = `${chart.code}:${kindPrefix}:${ref.id || idx}`;
            const isOpen = expandedSet.has(refKey);
            const simPct = Math.round((ref.similarity || 0) * 100);
            return `
              <div class="ux-ref-card" data-expanded="${isOpen}">
                <button type="button" class="ux-ref-card__head" data-ux-ref-toggle="${esc(refKey)}" aria-expanded="${isOpen}">
                  <span class="ux-ref-card__main">
                    <span class="ux-ref-card__id ux-num">${esc(ref.id)}</span>
                    <span class="ux-ref-card__title">${esc(ref.title)}</span>
                  </span>
                  <span class="ux-ref-card__aside">
                    <span class="ux-metric-meter">${renderRingMeterHtml(simPct, { tone: simPct >= 75 ? 'success' : simPct >= 45 ? 'warning' : 'neutral', size: 'sm' })}<span class="ux-metric-meter__val ux-num">${simPct}%</span></span>
                    <svg class="ux-ref-card__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 8.99993L12 14.9999L18 8.99988" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="16"/>
                    </svg>
                  </span>
                </button>
                <div class="ux-collapse" data-open="${isOpen}" ${isOpen ? '' : 'inert'}>
                  <div class="ux-collapse__inner">
                    <div class="ux-ref-card__detail">
                      <div class="ux-meta-strip ux-meta-strip--3">
                        <div class="ux-meta-item">
                          <span class="ux-meta-item__label">Base ratio</span>
                          <span class="ux-meta-item__val ux-ratio-chip">${renderMiniSplitSvg(parseRatioInsuredPct(ref.baseRatio || chart.baseRatio, chart.insuredFault))}<span class="ux-num">${esc(ref.baseRatio || chart.baseRatio)}</span></span>
                        </div>
                        <div class="ux-meta-item">
                          <span class="ux-meta-item__label">Authority</span>
                          <span class="ux-meta-item__val">${esc(ref.authority || 'Committee')} · ${esc(ref.date || '2024')}</span>
                        </div>
                        <div class="ux-meta-item">
                          <span class="ux-meta-item__label">Awarded ratio</span>
                          <span class="ux-meta-item__val ux-ratio-chip">${renderMiniSplitSvg(parseRatioInsuredPct(ref.rulingRatio || chart.baseRatio, chart.insuredFault))}<span class="ux-num">${esc(ref.rulingRatio || chart.baseRatio)}</span></span>
                        </div>
                      </div>
                      <div class="ux-ref-card__rows">
                        <div class="ux-ref-card__row">
                          <span class="ux-ref-card__kicker">Modifiers applied</span>
                          <p class="ux-ref-card__prose">${esc(ref.modifier || 'None (0%)')}</p>
                        </div>
                        <div class="ux-ref-card__row">
                          <span class="ux-ref-card__kicker">Ruling</span>
                          <p class="ux-ref-card__prose">${esc(ref.summary)}</p>
                        </div>
                        <div class="ux-ref-card__row">
                          <span class="ux-ref-card__kicker">Facts</span>
                          <p class="ux-ref-card__prose">${esc(ref.facts || ref.title)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  };

  const triggerStep2ToStep3 = (c, chart) => {
    const hasReport = c.versions.length > 0;
    const latest = hasReport ? c.versions[c.versions.length - 1] : null;
    const chartChanged = Boolean(latest && latest.chartCode !== chart.code);
    const needConfirm = !hasReport || chartChanged;
    const evList = getEvidenceList(c, chart);
    const selectedCount = getSelectedEvidenceList(c, chart).length;
    if (evList.length > 0 && selectedCount === 0) return;

    if (!needConfirm) {
      selectStep(3);
      return;
    }
    if (c.isClosed) return;
    c.interpretation = c.interpretation || 'Corroborated 4-cam synchronized proof bundle.';
    const hasNegoActivity = c.versions.length > 0 && (c.factors || []).length > 0;
    if (hasNegoActivity) {
      const dlg = dialogs.versionWarning;
      if (dlg) {
        dlg.dataset.pendingCaseId = c.id;
        openDialogSmooth(dlg);
        return;
      }
    }
    commitNewReportVersion(c);
  };

  const rerunStep2 = (c, chart, guidance = '') => {
    if (!c || !chart || c.isClosed) return;
    const cleanGuidance = String(guidance || '').trim();
    if (cleanGuidance) {
      c.rerunGuidance = { ...(c.rerunGuidance || {}), 2: cleanGuidance };
      c.guidanceBoostByStep = { ...(c.guidanceBoostByStep || {}), 2: (c.guidanceBoostByStep?.[2] || 0) + 2 };
    }
    store.evidenceDraft = null;
    if (isStep2EvidenceSheetOpen()) hideSpotlightLayer();
    else bridge.setTimelineDraftMode?.(false);
    c.evidenceAnalysedChart = null;
    c.step3AnalysedKey = null;
    delete store.expandedRefByCase[c.id];
    delete store.expandedModByCase[c.id];
    if (step2AnalysingEl) delete step2AnalysingEl.dataset.renderedKey;
    if (step3AnalysingEl) delete step3AnalysingEl.dataset.renderedKey;
    clearTimelineRangeFocus(c, true);
    logActivity(c.id, 'ANALYSIS', cleanGuidance ? `Re-corroborated Step 2 proof (${cleanGuidance})` : `Re-ran Step 2 corroboration for ${scenarioLabel(chart)}`, 'Adjuster');
    renderStep2(c, true);
  };

  const parseDraftSec = (val, fallback = 12.4) => {
    const match = String(val || '').trim().match(/^(?:(\d{1,2}):)?(\d{1,2}(?:\.\d+)?)$/);
    if (!match) return fallback;
    return Math.max(0, Math.min(24, (parseInt(match[1] || '0', 10) * 60) + (parseFloat(match[2]) || 0)));
  };

  const normalizeEvidenceMomentItem = (source, fallbackCam = 1, fallbackMaster = 15.0, idx = 0) => {
    const cam = Math.max(1, Math.min(4, Number(source?.cam || fallbackCam) || 1));
    const parsedCam1 = source?.time != null ? parseDraftSec(source.time, Math.max(0, fallbackMaster - 2.6)) : null;
    const rawMaster = Number.isFinite(source?.masterSec)
      ? Number(source.masterSec)
      : (parsedCam1 != null ? parsedCam1 + 2.6 : Number(fallbackMaster));
    const masterSec = Math.max(0, Math.min(30, Number.isFinite(rawMaster) ? rawMaster : 15.0));
    return {
      id: String(source?.id || `evm-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 5)}`),
      label: source?.label ? String(source.label) : '',
      cam,
      masterSec,
    };
  };

  const getActiveDraftMomentItem = (draft) => {
    if (!draft) return null;
    if (!Array.isArray(draft.momentItems) || draft.momentItems.length === 0) {
      draft.momentItems = [normalizeEvidenceMomentItem({ cam: draft.cam, masterSec: draft.masterSec }, draft.cam || 1, draft.masterSec || 15.0, 0)];
    }
    let active = draft.momentItems.find((x) => x.id === draft.activeMomentId);
    if (!active) {
      active = draft.momentItems[0];
      draft.activeMomentId = active.id;
    }
    return active;
  };

  const toStep2CueBadgeModel = (draft) => ({
    id: draft?.editId || 'ev-draft',
    mode: draft?.type === 'range' ? 'range' : 'moment',
    cam: Math.max(1, Math.min(4, Number(draft?.cam) || 1)),
    masterSec: Math.max(0, Math.min(30, Number(draft?.masterSec) || 15.0)),
    startMasterSec: Math.max(0, Math.min(29.5, Number(draft?.startMasterSec) || 13.5)),
    endMasterSec: Math.max(0.5, Math.min(30, Number(draft?.endMasterSec) || 16.5)),
  });

  const renderStep2DraftCuesHtml = (draft) => {
    if (!draft) return '';
    if (draft.type === 'range') {
      return renderStep2ContextBadgeHtml(toStep2CueBadgeModel(draft), { interactive: false, active: true });
    }
    const active = getActiveDraftMomentItem(draft);
    const items = draft.momentItems || [];
    const canDelete = items.length > 1;
    return `
      <div class="ux-ev-moment-list">
        ${items.map((m, idx) => {
          const isActive = m.id === active?.id;
          const camName = getCamShortName(m.cam || 1);
          const tLabel = formatMasterShort(m.masterSec);
          return `
            <span class="ux-ev-moment-chip" data-ux-s2-moment-chip="${esc(m.id)}" data-active="${isActive}">
              <button type="button" class="ds-button ds-button--ghost ux-ev-moment-chip__pick" data-ux-s2-moment-pick="${esc(m.id)}" aria-pressed="${isActive}" aria-label="Select moment ${idx + 1}: ${esc(camName)} at ${esc(tLabel)}">
                ${ICON_CLOCK_SM}
                <span class="ux-num" data-ux-s2-moment-label>${esc(camName)} · ${esc(tLabel)}</span>
              </button>
              ${canDelete ? `<button type="button" class="ds-button ds-button--ghost ds-button--icon ux-ev-moment-chip__del" data-ux-s2-moment-del="${esc(m.id)}" aria-label="Remove moment ${esc(tLabel)}">${ICON_CLOSE_SM}</button>` : ''}
            </span>
          `;
        }).join('')}
        <button type="button" class="ds-button ds-button--outline ds-button--sm ux-ev-moment-add" data-ux-s2-moment-add aria-label="Add another moment">${ICON_PLUS}<span>Add</span></button>
      </div>
    `;
  };

  const syncStep2EvidenceDraftToTimeline = (draft, { jumpVideo = false } = {}) => {
    if (!draft?.open) {
      bridge.setTimelineDraftMode?.(false);
      bridge.setTimelineFocusRange?.(null);
      bridge.setTimelineContextMarkers?.([]);
      return;
    }
    bridge.setTimelineDraftMode?.(true);

    if (draft.type === 'range') {
      bridge.setTimelineContextMarkers?.([]);
      const sMaster = Math.max(0, Math.min(29.4, Number(draft.startMasterSec) || 13.5));
      const eMaster = Math.max(sMaster + 0.5, Math.min(30, Number(draft.endMasterSec) || sMaster + 3.0));
      draft.startMasterSec = sMaster;
      draft.endMasterSec = eMaster;
      bridge.setTimelineFocusRange?.({
        key: 'step2-draft:range',
        startTime: formatSecMMSS(Math.max(0, sMaster - 2.6)),
        endTime: formatSecMMSS(Math.max(0.4, eMaster - 2.6)),
        startSec: sMaster - 2.6,
        endSec: eMaster - 2.6,
        startMasterSec: sMaster,
        endMasterSec: eMaster,
        cam: draft.cam,
      });
      if (jumpVideo) silentJumpVideoForReanalyse(draft.cam, sMaster);
    } else {
      bridge.setTimelineFocusRange?.(null);
      const active = getActiveDraftMomentItem(draft);
      const markers = (draft.momentItems || []).map((m, idx) => ({
        id: String(m.id),
        mode: 'moment',
        masterSec: m.masterSec,
        active: m.id === active?.id,
        title: `${getCamShortName(m.cam)} · ${formatMasterShort(m.masterSec)} (Moment ${idx + 1})`,
      }));
      bridge.setTimelineContextMarkers?.(markers);
      if (jumpVideo && active) silentJumpVideoForReanalyse(active.cam, active.masterSec);
    }
  };

  const bindStep2DraftCueEvents = (draft) => {
    if (!reanalyseSheetEl || !draft || draft.type === 'range') return;
    const liveWrapEl = reanalyseSheetEl.querySelector('[data-ux-s2-ev-live-wrap]');
    if (!liveWrapEl) return;

    liveWrapEl.querySelectorAll('[data-ux-s2-moment-pick]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const m = (draft.momentItems || []).find((x) => String(x.id) === String(btn.dataset.uxS2MomentPick));
        if (!m) return;
        draft.activeMomentId = m.id;
        draft.cam = m.cam;
        draft.masterSec = m.masterSec;
        silentJumpVideoForReanalyse(m.cam, m.masterSec);
        liveWrapEl.querySelectorAll('[data-ux-s2-moment-chip]').forEach((chipEl) => {
          const on = String(chipEl.dataset.uxS2MomentChip) === String(m.id);
          chipEl.dataset.active = String(on);
          chipEl.querySelector('[data-ux-s2-moment-pick]')?.setAttribute('aria-pressed', String(on));
        });
        syncStep2EvidenceDraftToTimeline(draft, { jumpVideo: false });
      });
    });

    liveWrapEl.querySelectorAll('[data-ux-s2-moment-del]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!Array.isArray(draft.momentItems) || draft.momentItems.length <= 1) return;
        const removeId = String(btn.dataset.uxS2MomentDel);
        const removedIdx = draft.momentItems.findIndex((x) => String(x.id) === removeId);
        if (removedIdx < 0) return;
        const wasActive = String(draft.activeMomentId) === removeId;
        draft.momentItems.splice(removedIdx, 1);
        const nextActive = draft.momentItems[Math.min(removedIdx, draft.momentItems.length - 1)] || draft.momentItems[0];
        if (wasActive && nextActive) {
          draft.activeMomentId = nextActive.id;
          draft.cam = nextActive.cam;
          draft.masterSec = nextActive.masterSec;
          silentJumpVideoForReanalyse(nextActive.cam, nextActive.masterSec);
        }
        syncStep2EvidenceBadgeDom(draft);
        syncStep2EvidenceDraftToTimeline(draft, { jumpVideo: false });
      });
    });

    liveWrapEl.querySelector('[data-ux-s2-moment-add]')?.addEventListener('click', () => {
      if (!Array.isArray(draft.momentItems)) draft.momentItems = [];
      const ph = bridge.getVideoPlayheadState?.() || {};
      let nextMaster = Number.isFinite(ph.masterSec) ? ph.masterSec : (draft.masterSec || 15.0);
      const nextCam = Math.max(1, Math.min(4, Number(ph.activeCamId || draft.cam || 1)));
      if (draft.momentItems.some((m) => Math.abs(m.masterSec - nextMaster) < 0.25)) {
        nextMaster = nextMaster + 1.5 <= 30 ? nextMaster + 1.5 : Math.max(0, nextMaster - 1.5);
      }
      const created = normalizeEvidenceMomentItem({ cam: nextCam, masterSec: nextMaster }, nextCam, nextMaster, draft.momentItems.length);
      draft.momentItems.push(created);
      draft.activeMomentId = created.id;
      draft.cam = created.cam;
      draft.masterSec = created.masterSec;
      silentJumpVideoForReanalyse(created.cam, created.masterSec);
      syncStep2EvidenceBadgeDom(draft);
      syncStep2EvidenceDraftToTimeline(draft, { jumpVideo: false });
    });
  };

  function syncStep2EvidenceBadgeDom(draft, { activeLabelOnly = false } = {}) {
    if (!reanalyseSheetEl || !draft) return;
    const liveWrapEl = reanalyseSheetEl.querySelector('[data-ux-s2-ev-live-wrap]');
    if (!liveWrapEl) return;
    if (activeLabelOnly && draft.type !== 'range') {
      const active = getActiveDraftMomentItem(draft);
      const chipEl = active ? liveWrapEl.querySelector(`[data-ux-s2-moment-chip="${CSS.escape(String(active.id))}"]`) : null;
      const labelEl = chipEl?.querySelector('[data-ux-s2-moment-label]');
      if (labelEl && active) {
        labelEl.textContent = `${getCamShortName(active.cam || 1)} · ${formatMasterShort(active.masterSec)}`;
        return;
      }
    }
    liveWrapEl.innerHTML = renderStep2DraftCuesHtml(draft);
    bindStep2DraftCueEvents(draft);
  }

  const closeStep2EvidenceSheet = ({ reRender = true } = {}) => {
    const draftCaseId = store.evidenceDraft?.caseId;
    const draftChartCode = store.evidenceDraft?.chartCode;
    store.evidenceDraft = null;
    hideSpotlightLayer();
    if (reRender && draftCaseId) {
      const curCase = getCase(draftCaseId);
      const curChart = curCase
        ? (getChartsForCase(curCase).find((ch) => ch.code === draftChartCode) || getSelectedChart(curCase))
        : null;
      if (curCase && curChart && store.activeStep === 2) {
        renderStep2Body(curCase, curChart, false);
        renderVideoTimeline(curCase);
      }
    }
  };

  const renderStep2EvidenceSheet = (c, chart) => {
    if (!reanalyseSheetEl || !c || !chart) return;
    const draft = store.evidenceDraft;
    if (!draft) return;

    const isRange = draft.type === 'range';
    const hasTitle = Boolean(String(draft.title || '').trim());
    reanalyseSheetEl.dataset.sheetMode = 'evidence';

    reanalyseSheetEl.innerHTML = `
      <div class="ux-dialog__header">
        <div class="ux-dialog__title-wrap">
          <h3 class="ux-dialog__title">${draft.editId ? 'Edit evidence' : 'Add evidence'}</h3>
        </div>
      </div>

      <div class="ux-dialog__body ux-reanalyse-sheet__body ds-scrollbar" data-ux-reanalyse-body>
        <form id="ux-s2-evidence-form" class="ux-reanalyse-composer" data-ux-s2-ev-form>
          <div class="ux-ev-sheet-field">
            <label class="ds-label" for="ux-ev-sheet-title">Title</label>
            <input id="ux-ev-sheet-title" class="ds-input ux-ev-sheet-title" data-ux-ev-sheet-title type="text" value="${esc(draft.title || '')}" placeholder="e.g. Late red cross-traffic window" required />
          </div>

          <div class="ux-ev-sheet-field">
            <label class="ds-label" for="ux-ev-sheet-desc">Description</label>
            <div class="ux-reanalyse-composer-card">
              <textarea id="ux-ev-sheet-desc" class="ds-textarea ux-reanalyse-input" data-ux-ev-sheet-desc rows="2" placeholder="Describe supporting observation...">${esc(draft.supportText || '')}</textarea>
              <div class="ux-reanalyse-composer-card__foot">
                <div class="ux-reanalyse-composer-card__bar">
                  <span class="ds-label">Evidence</span>
                  <div class="ds-segmented ds-segmented--sm ux-reanalyse-mode" data-ds-segmented data-ux-s2-ev-mode role="radiogroup" aria-label="Evidence cue type">
                    <div class="ds-segmented__thumb"></div>
                    <button type="button" role="radio" data-value="keyframe" aria-checked="${!isRange}" aria-pressed="${!isRange}" data-state="${!isRange ? 'on' : 'off'}">Moment</button>
                    <button type="button" role="radio" data-value="range" aria-checked="${isRange}" aria-pressed="${isRange}" data-state="${isRange ? 'on' : 'off'}">Range</button>
                  </div>
                </div>
                <div class="ux-reanalyse-composer-card__bar ux-ev-sheet-cues-bar">
                  <div class="ux-reanalyse-anchor-box__live" data-ux-s2-ev-live-wrap>
                    ${renderStep2DraftCuesHtml(draft)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="ux-dialog__footer">
        <button type="button" class="ds-button ds-button--secondary" data-ux-s2-ev-close>Cancel</button>
        <button type="submit" form="ux-s2-evidence-form" class="ds-button ds-button--primary" data-ux-s2-ev-submit${hasTitle ? '' : ' disabled'}>
          <span>${draft.editId ? 'Save changes' : 'Add evidence'}</span>
        </button>
      </div>
    `;

    const formEl = reanalyseSheetEl.querySelector('[data-ux-s2-ev-form]');
    const titleInp = reanalyseSheetEl.querySelector('[data-ux-ev-sheet-title]');
    const descInp = reanalyseSheetEl.querySelector('[data-ux-ev-sheet-desc]');
    const modeSeg = reanalyseSheetEl.querySelector('[data-ux-s2-ev-mode]');
    const submitBtn = reanalyseSheetEl.querySelector('[data-ux-s2-ev-submit]');

    titleInp?.addEventListener('input', () => {
      draft.title = titleInp.value;
      if (submitBtn) submitBtn.disabled = !String(draft.title || '').trim();
    });

    descInp?.addEventListener('input', () => {
      draft.supportText = descInp.value;
    });

    descInp?.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        formEl?.requestSubmit?.();
      }
    });

    bindStep2DraftCueEvents(draft);

    if (modeSeg) {
      requestAnimationFrame(() => syncSegmentedThumb(modeSeg));
      modeSeg.querySelectorAll('[role="radio"]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const nextType = btn.dataset.value === 'range' ? 'range' : 'keyframe';
          if (draft.type === nextType) return;
          draft.type = nextType;
          const ph = bridge.getVideoPlayheadState?.() || {};
          if (nextType === 'keyframe') {
            const active = getActiveDraftMomentItem(draft);
            if (active) {
              draft.masterSec = active.masterSec;
              draft.cam = active.cam;
            } else {
              draft.masterSec = Number.isFinite(ph.masterSec) ? ph.masterSec : draft.masterSec;
              draft.cam = Number(ph.activeCamId || draft.cam || 1);
            }
          } else {
            const center = Number.isFinite(ph.masterSec) ? ph.masterSec : draft.masterSec;
            draft.startMasterSec = Math.max(0, Math.min(27.0, center - 1.5));
            draft.endMasterSec = Math.min(30, draft.startMasterSec + 3.0);
            draft.cam = Number(ph.activeCamId || draft.cam || 1);
          }
          modeSeg.querySelectorAll('[role="radio"]').forEach((rb) => {
            const on = rb.dataset.value === nextType;
            rb.setAttribute('aria-checked', String(on));
            rb.setAttribute('aria-pressed', String(on));
            rb.dataset.state = on ? 'on' : 'off';
          });
          syncSegmentedThumb(modeSeg);
          syncStep2EvidenceBadgeDom(draft);
          syncStep2EvidenceDraftToTimeline(draft, { jumpVideo: nextType === 'keyframe' });
        });
      });
    }

    reanalyseSheetEl.querySelector('[data-ux-s2-ev-close]')?.addEventListener('click', () => {
      closeStep2EvidenceSheet({ reRender: false });
    });

    formEl?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (c.isClosed) return;
      const title = String(titleInp?.value ?? draft.title ?? '').trim();
      if (!title) {
        titleInp?.focus({ preventScroll: true });
        return;
      }
      const desc = String(descInp?.value ?? draft.supportText ?? '').trim();
      const cam = Math.max(1, Math.min(4, Number(draft.cam) || 1));
      const evId = draft.editId || `ev-custom-${Date.now()}`;
      const isRangeSave = draft.type === 'range';

      let payload;
      if (isRangeSave) {
        const sCam1 = Math.max(0, Math.min(23.5, (Number(draft.startMasterSec) || 13.5) - 2.6));
        const eCam1 = Math.max(sCam1 + 0.5, Math.min(24, (Number(draft.endMasterSec) || 16.5) - 2.6));
        const startTime = formatSecMMSS(sCam1);
        const endTime = formatSecMMSS(eCam1);
        payload = {
          id: evId,
          title,
          supportText: desc || `Validated on ${getCamShortName(cam)} (${startTime.replace(/^00:/, '0:')}–${endTime.replace(/^00:/, '0:')}).`,
          type: 'range',
          startTime,
          endTime,
          cam,
          hud: title.slice(0, 22),
          reticle: 'lane',
          moments: null,
          keyframes: Array.isArray(draft.keyframes) && draft.keyframes.length
            ? draft.keyframes
            : [{ id: `${evId}-k0`, label: title.slice(0, 20), time: startTime, cam, hud: title.slice(0, 22), reticle: 'lane' }],
        };
      } else {
        const rawMoments = Array.isArray(draft.momentItems) && draft.momentItems.length
          ? draft.momentItems
          : [normalizeEvidenceMomentItem({ cam, masterSec: draft.masterSec }, cam, draft.masterSec || 15.0, 0)];
        const sortedMoments = [...rawMoments].sort((a, b) => a.masterSec - b.masterSec);
        const savedMoments = sortedMoments.map((m, idx) => {
          const mCam = Math.max(1, Math.min(4, Number(m.cam) || 1));
          const mMaster = Math.max(0, Math.min(30, Number(m.masterSec) || 15.0));
          const mCam1Sec = Math.max(0, Math.min(24, mMaster - 2.6));
          const mTime = formatSecMMSS(mCam1Sec);
          return {
            id: m.id || `${evId}-m${idx}`,
            label: m.label || `${getCamShortName(mCam)} · ${formatMasterShort(mMaster)}`,
            cam: mCam,
            masterSec: mMaster,
            cam1Sec: mCam1Sec,
            time: mTime,
            hud: idx === 0 ? title.slice(0, 22) : `${getCamShortName(mCam)} · ${formatMasterShort(mMaster)}`,
            isPrimary: idx === 0,
            reticle: 'impact',
          };
        });
        const primaryM = savedMoments[0];
        const summaryCue = savedMoments.length > 1
          ? `${savedMoments.length} moments · ${savedMoments.map((m) => `${getCamShortName(m.cam)} ${formatMasterShort(m.masterSec)}`).join(', ')}`
          : `Validated on ${getCamShortName(primaryM.cam)} (${formatMasterShort(primaryM.masterSec)})`;
        payload = {
          id: evId,
          title,
          supportText: desc || `${summaryCue}.`,
          type: 'keyframe',
          time: primaryM.time,
          cam: primaryM.cam,
          masterSec: primaryM.masterSec,
          startTime: undefined,
          endTime: undefined,
          hud: title.slice(0, 22),
          reticle: 'impact',
          moments: savedMoments,
          keyframes: null,
        };
      }

      if (draft.isTemplateEdit) {
        if (!c.evidenceOverridesByChart) c.evidenceOverridesByChart = {};
        if (!c.evidenceOverridesByChart[chart.code]) c.evidenceOverridesByChart[chart.code] = {};
        const orig = (chart.evidenceTemplate || []).find((x) => x.id === evId) || {};
        c.evidenceOverridesByChart[chart.code][evId] = { ...orig, ...payload };
        logActivity(c.id, 'ANALYSIS', `Updated evidence item: ${title}`, 'Adjuster');
      } else {
        if (!c.customEvidenceByChart) c.customEvidenceByChart = {};
        if (!Array.isArray(c.customEvidenceByChart[chart.code])) c.customEvidenceByChart[chart.code] = [];
        const list = c.customEvidenceByChart[chart.code];
        const existingIdx = draft.editId ? list.findIndex((x) => x.id === draft.editId) : -1;
        if (existingIdx >= 0) {
          list[existingIdx] = { ...list[existingIdx], ...payload };
          logActivity(c.id, 'ANALYSIS', `Updated evidence item: ${title}`, 'Adjuster');
        } else {
          list.push({ conf: 100, manual: true, ...payload });
          if (!c.selectedEvidenceMap) c.selectedEvidenceMap = {};
          c.selectedEvidenceMap[`${chart.code}:${evId}`] = true;
          logActivity(c.id, 'ANALYSIS', `Added supporting evidence: ${title} (${getCamShortName(cam)})`, 'Adjuster');
        }
      }

      c.step3AnalysedKey = null;
      if (step3AnalysingEl) delete step3AnalysingEl.dataset.renderedKey;
      closeStep2EvidenceSheet({ reRender: true });
      renderFloatBar(c);
    });
  };

  const openEvidenceEditor = (c, chart, existingEv = null) => {
    if (!c || !chart || c.isClosed || !reanalyseLayerEl || !reanalyseSheetEl) return;
    clearTimeout(reanalyseCloseTimer);
    reanalyseCloseTimer = 0;
    if (store.step1ReanalyseDraft) store.step1ReanalyseDraft.open = false;
    bridge.setAgentPanelOpen?.(false);

    const ph = bridge.getVideoPlayheadState?.() || {};
    const liveMaster = Number.isFinite(ph.masterSec) ? ph.masterSec : 15.0;
    const liveCam = Math.max(1, Math.min(4, Number(ph.activeCamId || videoCanvasEl?.dataset.activeCam || 1)));

    const isTemplateEdit = Boolean(existingEv && (chart.evidenceTemplate || []).some((t) => t.id === existingEv.id));
    const draftType = existingEv?.type === 'range' ? 'range' : 'keyframe';

    let masterSec = liveMaster;
    let startMasterSec = Math.max(0, Math.min(27.0, liveMaster - 1.5));
    let endMasterSec = Math.min(30, startMasterSec + 3.0);
    let cam = liveCam;

    if (existingEv) {
      cam = Math.max(1, Math.min(4, Number(existingEv.cam) || liveCam));
      if (draftType === 'range') {
        const sCam1 = parseDraftSec(existingEv.startTime, Math.max(0, liveMaster - 2.6 - 1.5));
        const eCam1 = Math.max(sCam1 + 0.4, parseDraftSec(existingEv.endTime, Math.min(24, sCam1 + 3.0)));
        startMasterSec = Math.max(0, Math.min(29.4, sCam1 + 2.6));
        endMasterSec = Math.max(startMasterSec + 0.5, Math.min(30, eCam1 + 2.6));
        masterSec = startMasterSec;
      } else {
        const tCam1 = parseDraftSec(existingEv.time, Math.max(0, liveMaster - 2.6));
        masterSec = Math.max(0, Math.min(30, tCam1 + 2.6));
        startMasterSec = Math.max(0, Math.min(27.0, masterSec - 1.5));
        endMasterSec = Math.min(30, startMasterSec + 3.0);
      }
    }

    let momentItems;
    if (existingEv && draftType !== 'range' && Array.isArray(existingEv.moments) && existingEv.moments.length) {
      momentItems = existingEv.moments.map((m, i) => normalizeEvidenceMomentItem(m, cam, masterSec, i));
    } else {
      momentItems = [normalizeEvidenceMomentItem({
        id: existingEv ? `${existingEv.id}-m0` : null,
        cam,
        masterSec,
      }, cam, masterSec, 0)];
    }

    store.evidenceDraft = {
      caseId: c.id,
      chartCode: chart.code,
      open: true,
      editId: existingEv?.id || null,
      isTemplateEdit,
      title: existingEv?.title || '',
      supportText: existingEv?.supportText || '',
      type: draftType,
      cam: momentItems[0]?.cam || cam,
      masterSec: momentItems[0]?.masterSec ?? masterSec,
      momentItems,
      activeMomentId: momentItems[0]?.id || null,
      startMasterSec,
      endMasterSec,
      origType: existingEv ? draftType : null,
      origMasterSec: existingEv ? masterSec : null,
      moments: Array.isArray(existingEv?.moments) ? existingEv.moments : null,
      keyframes: Array.isArray(existingEv?.keyframes) ? existingEv.keyframes : null,
    };

    if (store.step2SubTab !== 'supporting') {
      store.step2SubTab = 'supporting';
      renderStep2Body(c, chart, false);
    }

    if (detailWorkspacesEl) detailWorkspacesEl.dataset.reanalyseOpen = 'true';
    renderStep2EvidenceSheet(c, chart);
    syncStep2EvidenceDraftToTimeline(store.evidenceDraft, { jumpVideo: Boolean(existingEv) });

    reanalyseLayerEl.hidden = false;
    syncReanalyseSheetPosition();
    requestAnimationFrame(() => {
      if (store.evidenceDraft?.open && reanalyseLayerEl) {
        syncReanalyseSheetPosition();
        reanalyseLayerEl.dataset.open = 'true';
        const titleEl = reanalyseSheetEl.querySelector('[data-ux-ev-sheet-title]');
        titleEl?.focus({ preventScroll: true });
        if (titleEl && existingEv) titleEl.setSelectionRange?.(titleEl.value.length, titleEl.value.length);
      }
    });
  };

  document.addEventListener('ux-timeline-draft-change', (e) => {
    if (silentReanalyseVideoSync) return;
    const step1Draft = store.step1ReanalyseDraft;
    if (store.activeStep === 1 && step1Draft?.open) {
      const { kind, camId, masterSec, startMasterSec, endMasterSec } = e.detail || {};
      if (camId) step1Draft.cam = Math.max(1, Math.min(4, Number(camId)));
      if (kind === 'range' && step1Draft.mode === 'range') {
        if (Number.isFinite(startMasterSec)) step1Draft.startMasterSec = startMasterSec;
        if (Number.isFinite(endMasterSec)) step1Draft.endMasterSec = endMasterSec;
      } else if (Number.isFinite(masterSec)) {
        step1Draft.masterSec = masterSec;
      }
      syncReanalyseCueBadgeDom(step1Draft);
      return;
    }

    const evDraft = store.evidenceDraft;
    if (store.activeStep === 2 && evDraft?.open) {
      const { kind, camId, masterSec, startMasterSec, endMasterSec } = e.detail || {};
      if (evDraft.type === 'range') {
        if (camId) evDraft.cam = Math.max(1, Math.min(4, Number(camId)));
        if (kind === 'range') {
          if (Number.isFinite(startMasterSec)) evDraft.startMasterSec = startMasterSec;
          if (Number.isFinite(endMasterSec)) evDraft.endMasterSec = endMasterSec;
        }
        syncStep2EvidenceBadgeDom(evDraft);
      } else {
        const activeM = getActiveDraftMomentItem(evDraft);
        if (activeM) {
          if (camId) activeM.cam = Math.max(1, Math.min(4, Number(camId)));
          if (Number.isFinite(masterSec)) activeM.masterSec = Math.max(0, Math.min(30, masterSec));
          evDraft.cam = activeM.cam;
          evDraft.masterSec = activeM.masterSec;
        }
        syncStep2EvidenceBadgeDom(evDraft, { activeLabelOnly: true });
        syncStep2EvidenceDraftToTimeline(evDraft, { jumpVideo: false });
      }
    }
  });

  const renderStep2Body = (c, chart, animateReveal = false) => {
    if (!step2BodyEl) return;
    step2BodyEl.hidden = false;
    const hasReport = c.versions.length > 0;
    const latest = hasReport ? c.versions[c.versions.length - 1] : null;
    const nextVer = `v${c.versions.length + 1}`;
    const chartChanged = Boolean(latest && latest.chartCode !== chart.code);
    if (store.step2SubTab === 'factors') store.step2SubTab = 'references';
    const evList = getEvidenceList(c, chart);
    const selectedList = getSelectedEvidenceList(c, chart);
    const similarCases = getSimilarResolvedCases(chart);
    const expandedRefSet = getCaseSet(store.expandedRefByCase, c.id);
    const disputes = chart.disputes || [];
    const precedents = chart.precedents || [];
    const allRefsCount = disputes.length + precedents.length;

    const renderSupportingEvidenceHtml = () => {
      if (evList.length === 0) return '<p class="ux-subtitle">No evidence attached yet</p>';
      return `
        <div class="ux-ev-list">
          ${evList.map((ev, idx) => {
            const evId = ev.id || idx;
            const evKey = getEvidenceTagKey(chart, ev, idx);
            const isSelected = isEvidenceSelected(c, chart.code, evId);
            const isEvActive = isSelected && isEvidenceTagActive(evKey, ev.type === 'range');
            const hasMultiMoments = (ev.type === 'range' && Array.isArray(ev.keyframes) && ev.keyframes.length > 0)
              || (ev.type !== 'range');
            return `
              <div class="ux-ev-item" data-ux-ev-item-key="${esc(evKey)}" data-ux-ev-id="${esc(evId)}" data-selected="${isSelected}" data-active="${isEvActive}">
                <div class="ux-ev-item__head">
                  <span class="ux-ev-item__main">
                    <label class="ds-checkbox ux-ev-item__check">
                      <input type="checkbox" data-ux-ev-toggle="${esc(evId)}" ${isSelected ? 'checked' : ''} ${c.isClosed ? 'disabled' : ''} aria-label="Include ${esc(ev.title)}" />
                      <span class="ds-checkbox__control">
                        <svg class="ds-checkbox__check" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.75 8.25L6.5 11L12.25 5.25"></path></svg>
                        <svg class="ds-checkbox__dash" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.75 8h8.5"></path></svg>
                      </span>
                    </label>
                    <span class="ux-ev-item__title">${esc(ev.title)}</span>
                  </span>
                  <span class="ux-ev-item__actions">
                    ${ev.manual ? '<span class="ds-badge ds-badge--pill ds-badge--neutral">Manual</span>' : `<span class="ux-metric-meter">${renderRingMeterHtml(ev.conf || 0, { tone: (ev.conf || 0) >= 90 ? 'success' : (ev.conf || 0) >= 75 ? 'warning' : 'danger', size: 'sm' })}<span class="ux-metric-meter__val ux-num">${esc(ev.conf)}%</span></span>`}
                    ${c.isClosed ? '' : `<button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm ux-ev-item__edit-btn" data-ux-ev-edit="${esc(evId)}" aria-label="Edit ${esc(ev.title)}" title="Edit evidence">${ICON_EDIT_SM}</button>`}
                  </span>
                </div>
                <p class="ux-ev-item__desc">${esc(ev.supportText)}</p>
                ${ev.type === 'range' ? `
                  <div class="ux-ev-item__tags">
                    ${renderCueTrackHtml(chart, ev, idx)}
                  </div>
                ` : (Array.isArray(ev.moments) && ev.moments.length > 0 ? `
                  <div class="ux-ev-item__tags">
                    ${ev.moments.map((m, mIdx) => {
                      const mMaster = Number.isFinite(m.masterSec) ? m.masterSec : (parseTimeSec(m.time || ev.time) + 2.6);
                      const mCam = getCamShortName(m.cam || ev.cam || 1);
                      const mLabel = `${mCam} · ${formatMasterShort(mMaster)}`;
                      const pillKey = `${evKey}:m${mIdx}`;
                      const isPillActive = !store.activeTimelineRange && store.activeConditionTarget?.key === pillKey;
                      return `<button type="button" class="ux-ev-tag" data-ux-ev-moment-jump="${esc(evId)}" data-ux-ev-moment-idx="${mIdx}" data-ux-ev-tag-key="${esc(pillKey)}" data-active="${isPillActive}" aria-label="Jump to ${esc(mLabel)}">${ICON_CLOCK_SM}<span class="ux-num">${esc(mLabel)}</span></button>`;
                    }).join('')}
                  </div>
                ` : '')}
                ${hasMultiMoments ? renderEvidenceKeyframeStackHtml(c, chart, ev, idx) : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    };

    if (chartChanged) {
      const toastKey = `${c.id}:${latest.chartCode}->${chart.code}:${nextVer}`;
      if (toastKey !== lastScenarioToastKey) {
        lastScenarioToastKey = toastKey;
        showUxToast(`${esc(scenarioLabel(latest.chartCode))} ${ICON_ARROW_RIGHT} ${esc(scenarioLabel(chart))} · Corroborating creates ${esc(nextVer)}`);
      }
    } else {
      lastScenarioToastKey = '';
      hideUxToast();
    }

    step2BodyEl.innerHTML = `
      <div class="ux-section${animateReveal ? ' ux-reveal' : ''}">
        <section class="ux-heading-block ux-heading-block--s2" aria-label="Scenario conclusion to corroborate">
          <div class="ux-heading-block__head">
            <span class="ux-heading-block__kicker ux-num">${esc(scenarioLabel(chart))} · ${esc(chart.title)}</span>
          </div>
          <div class="ux-heading-block__hero">
            <div class="ux-heading-block__thumb" data-ux-s2-sim-stage>
              ${buildScenarioSimulationSvg(chart, { animated: true })}
              <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm ux-heading-block__replay" data-ux-s2-replay-sim aria-label="Replay simulation" title="Replay">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.2716 2 18.1763 3.57111 20.0007 6V2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div class="ux-heading-block__summary">
              <div class="ux-split-header">
                <div class="ux-split-side">
                  <span class="ux-split-side__num">${esc(chart.insuredFault)}%</span>
                </div>
                <div class="ux-split-side ux-split-side--right">
                  <span class="ux-split-side__num">${esc(chart.counterpartyFault)}%</span>
                </div>
              </div>
              ${renderSplitBarHtml({ cls: 'ux-as-split-track' })}
              <div class="ux-heading-block__parties">
                <span class="ux-heading-block__party">
                  <span class="ux-as-dot ux-as-dot--a" aria-hidden="true"></span>
                  <span class="ux-heading-block__party-key">A</span>
                  <span>${esc(chart.partyARole || 'Insured')}</span>
                </span>
                <span class="ux-heading-block__party">
                  <span class="ux-heading-block__party-key">B</span>
                  <span>${esc(chart.partyBRole || 'Counterparty')}</span>
                  <span class="ux-as-dot ux-as-dot--b" aria-hidden="true"></span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section class="ux-info-canvas" aria-label="Corroboration and proof">
          <div class="ux-s2-tabs-row">
            <div class="ds-tabs ux-s2-tabs" data-ds-tabs role="tablist" aria-label="Corroboration sections">
              <button type="button" class="ds-tab" role="tab" data-value="supporting" data-panel="ux-s2-panel-supporting" aria-controls="ux-s2-panel-supporting" aria-selected="${store.step2SubTab === 'supporting'}">
                <span class="ds-tab__content">Evidences <span class="ds-badge ds-badge--pill ds-badge--default ux-num" data-ux-s2-ev-count>${selectedList.length}</span></span>
              </button>
              <button type="button" class="ds-tab" role="tab" data-value="references" data-panel="ux-s2-panel-references" aria-controls="ux-s2-panel-references" aria-selected="${store.step2SubTab === 'references'}">
                <span class="ds-tab__content">Matching cases <span class="ds-badge ds-badge--pill ds-badge--default ux-num">${similarCases.length}</span></span>
              </button>
              <button type="button" class="ds-tab" role="tab" data-value="precedents" data-panel="ux-s2-panel-precedents" aria-controls="ux-s2-panel-precedents" aria-selected="${store.step2SubTab === 'precedents'}">
                <span class="ds-tab__content">Legal rulings <span class="ds-badge ds-badge--pill ds-badge--default ux-num">${allRefsCount}</span></span>
              </button>
              <span class="ds-tabs__indicator" aria-hidden="true"></span>
            </div>
          </div>

          <div class="ux-tab-stage" data-ux-s2-tabstage>
          <div id="ux-s2-panel-supporting" class="ds-tabpanel ux-tabpanel" role="tabpanel" ${store.step2SubTab === 'supporting' ? '' : 'hidden'}>
            <div class="ux-s2-ev-toolbar">
              <button type="button" class="ds-button ds-button--secondary" data-ux-s2-add-evidence ${c.isClosed ? 'disabled' : ''}>${ICON_PLUS}<span>Add evidence</span></button>
            </div>
            ${renderSupportingEvidenceHtml()}
          </div>

          <div id="ux-s2-panel-references" class="ds-tabpanel ux-tabpanel" role="tabpanel" ${store.step2SubTab === 'references' ? '' : 'hidden'}>
            ${similarCases.length === 0 ? '<p class="ux-subtitle">No matching settled cases yet</p>' : `
              <div class="ux-ref-group">
                <div class="ux-section-head">
                  <h3 class="ux-title">Corroborating settled cases</h3>
                </div>
                <div class="ux-ref-list">
                  ${similarCases.map((rc, idx) => {
                    const refKey = `${chart.code}:resolved:${rc.caseId || idx}`;
                    const isOpen = expandedRefSet.has(refKey);
                    const simPct = Math.round((rc.similarity || 0) * 100);
                    return `
                      <div class="ux-ref-card" data-expanded="${isOpen}">
                        <button type="button" class="ux-ref-card__head" data-ux-ref-toggle="${esc(refKey)}" aria-expanded="${isOpen}">
                          <span class="ux-ref-card__main">
                            <span class="ux-ref-card__id ux-num">${esc(rc.caseId)}</span>
                            <span class="ux-ref-card__title">${esc(rc.title)}</span>
                          </span>
                          <span class="ux-ref-card__aside">
                            <span class="ux-metric-meter">${renderRingMeterHtml(simPct, { tone: simPct >= 85 ? 'success' : simPct >= 65 ? 'warning' : 'neutral', size: 'sm' })}<span class="ux-metric-meter__val ux-num">${simPct}%</span></span>
                            <svg class="ux-ref-card__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path d="M6 8.99993L12 14.9999L18 8.99988" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="16"/>
                            </svg>
                          </span>
                        </button>
                        <div class="ux-collapse" data-open="${isOpen}" ${isOpen ? '' : 'inert'}>
                          <div class="ux-collapse__inner">
                            <div class="ux-ref-card__detail">
                              <div class="ux-meta-strip ux-meta-strip--3">
                                <div class="ux-meta-item">
                                  <span class="ux-meta-item__label">Base ratio</span>
                                  <span class="ux-meta-item__val ux-ratio-chip">${renderMiniSplitSvg(parseRatioInsuredPct(rc.baseRatio, chart.insuredFault))}<span class="ux-num">${esc(rc.baseRatio)}</span></span>
                                </div>
                                <div class="ux-meta-item">
                                  <span class="ux-meta-item__label">Disposition</span>
                                  <span class="ux-meta-item__val">${esc(rc.disposition)} · ${esc(rc.resolvedDate)}</span>
                                </div>
                                <div class="ux-meta-item">
                                  <span class="ux-meta-item__label">Final ratio</span>
                                  <span class="ux-meta-item__val ux-ratio-chip">${renderMiniSplitSvg(parseRatioInsuredPct(rc.settledRatio, chart.insuredFault))}<span class="ux-num">${esc(rc.settledRatio)}</span></span>
                                </div>
                              </div>
                              <div class="ux-ref-card__rows">
                                <div class="ux-ref-card__row">
                                  <span class="ux-ref-card__kicker">Modifiers applied</span>
                                  <p class="ux-ref-card__prose">${esc(rc.appliedModifiers)}</p>
                                </div>
                                <div class="ux-ref-card__row">
                                  <span class="ux-ref-card__kicker">Resolution</span>
                                  <p class="ux-ref-card__prose">${esc(rc.summary)}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `}
          </div>

          <div id="ux-s2-panel-precedents" class="ds-tabpanel ux-tabpanel" role="tabpanel" ${store.step2SubTab === 'precedents' ? '' : 'hidden'}>
            ${allRefsCount === 0 ? '<p class="ux-subtitle">No dispute decisions or court precedents linked</p>' : `
              <div class="ux-ref-stack">
                ${renderRefSectionHtml(c, chart, 'Supporting dispute decisions', disputes, 'dispute')}
                ${renderRefSectionHtml(c, chart, 'Supporting court precedents', precedents, 'court')}
              </div>
            `}
          </div>
          </div>
        </section>
      </div>
    `;

    step2BodyEl.querySelector('.ux-heading-block--s2 .ux-as-split-track')?.style.setProperty('--ratio-a', String(clampRatioUnit(chart.insuredFault)));
    mountFreshRoot(step2BodyEl);
    mountScenarioSimulations(step2BodyEl);

    bindZeroJumpTabStage({
      tabsEl: step2BodyEl.querySelector('[data-ds-tabs]'),
      stageEl: step2BodyEl.querySelector('[data-ux-s2-tabstage]'),
      scrollEl: document.querySelector('.ds-detail-workspace--primary'),
    });

    step2BodyEl.querySelector('[data-ux-s2-replay-sim]')?.addEventListener('click', () => {
      const svg = step2BodyEl.querySelector('[data-ux-s2-sim-stage] svg');
      if (svg) playScenarioSimulation(svg, { force: true });
    });

    step2BodyEl.querySelector('[data-ux-s2-sim-stage]')?.addEventListener('click', (e) => {
      if (e.target.closest('[data-ux-s2-replay-sim]')) return;
      const svg = step2BodyEl.querySelector('[data-ux-s2-sim-stage] svg');
      if (svg) playScenarioSimulation(svg, { force: true });
    });

    step2BodyEl.querySelector('[data-ux-s2-add-evidence]')?.addEventListener('click', () => openEvidenceEditor(c, chart, null));

    const s2TabsEl = step2BodyEl.querySelector('[data-ds-tabs]');
    const s2StageEl = step2BodyEl.querySelector('[data-ux-s2-tabstage]');
    const syncStep2TabPanels = (activeValue) => {
      if (!s2StageEl) return;
      const targetTab = Array.from(s2TabsEl?.querySelectorAll('[role="tab"]') || [])
        .find((t) => (t.dataset.value || '') === activeValue);
      const targetPanelId = targetTab?.dataset.panel || targetTab?.getAttribute('aria-controls');
      if (!targetPanelId) return;
      s2StageEl.querySelectorAll(':scope > [role="tabpanel"], :scope > .ds-tabpanel').forEach((panel) => {
        panel.hidden = panel.id !== targetPanelId;
      });
    };

    s2TabsEl?.addEventListener('ds-tab-change', (e) => {
      if (e.detail?.value) {
        store.step2SubTab = e.detail.value;
        syncStep2TabPanels(e.detail.value);
      }
    });

    const refreshEvidencePanel = () => {
      const supportingPanel = step2BodyEl.querySelector('#ux-s2-panel-supporting');
      if (supportingPanel) {
        supportingPanel.querySelectorAll('.ux-ev-item').forEach((itemEl) => {
          const evId = itemEl.dataset.uxEvId;
          const isSelected = isEvidenceSelected(c, chart.code, evId);
          itemEl.dataset.selected = String(isSelected);
          const toggleInput = itemEl.querySelector('[data-ux-ev-toggle]');
          if (toggleInput) toggleInput.checked = isSelected;
          if (!isSelected) itemEl.dataset.active = 'false';
        });
      }
      const liveSelected = getSelectedEvidenceList(c, chart);
      const evCountBadge = step2BodyEl.querySelector('[data-ux-s2-ev-count]');
      if (evCountBadge) {
        evCountBadge.textContent = String(liveSelected.length);
      }
      renderVideoTimeline(c);
      renderFloatBar(c);
    };

    const setEvidenceSelected = (evId, nextSelected) => {
      if (c.isClosed) return;
      const ev = evList.find((x, i) => String(x.id || i) === String(evId));
      if (!ev) return;
      if (!c.selectedEvidenceMap) c.selectedEvidenceMap = {};
      c.selectedEvidenceMap[`${chart.code}:${evId}`] = nextSelected;
      c.step3AnalysedKey = null;
      if (step3AnalysingEl) delete step3AnalysingEl.dataset.renderedKey;
      if (!nextSelected) {
        const evKey = `ev:${chart.code}:${evId}`;
        if (store.activeTimelineRange?.key === evKey) {
          store.activeConditionTarget = null;
          renderStageOverlay(null);
          clearTimelineRangeFocus(c, false);
        } else if (store.activeConditionTarget?.key === evKey || store.activeStep2EvidenceTag?.key === evKey) {
          store.activeConditionTarget = null;
          store.activeStep2EvidenceTag = null;
          renderStageOverlay(null);
        }
        logActivity(c.id, 'ANALYSIS', `Excluded proof item: ${ev.title}`, 'Adjuster');
      } else {
        logActivity(c.id, 'ANALYSIS', `Included proof item: ${ev.title}`, 'Adjuster');
      }
      refreshEvidencePanel();
    };

    const bindSupportingEvidenceEvents = (supportingPanel) => {
      if (!supportingPanel) return;
      supportingPanel.querySelectorAll('.ux-ev-item__check').forEach((lbl) => {
        lbl.addEventListener('click', (e) => e.stopPropagation());
      });
      supportingPanel.querySelectorAll('[data-ux-ev-toggle]').forEach((inp) => {
        inp.addEventListener('change', () => {
          setEvidenceSelected(inp.dataset.uxEvToggle, inp.checked);
        });
      });

      supportingPanel.querySelectorAll('[data-ux-ev-edit]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const ev = evList.find((x, i) => String(x.id ?? i) === String(btn.dataset.uxEvEdit));
          if (ev) openEvidenceEditor(c, chart, ev);
        });
      });

      bindEvidenceTagClicks(supportingPanel, c, chart, evList);
      supportingPanel.querySelectorAll('[data-ux-ev-kf-open]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const ev = evList.find((x, i) => String(x.id ?? i) === String(btn.dataset.uxEvKfOpen));
          if (!ev) return;
          const mIdx = Number(btn.dataset.uxEvKfMoment);
          const cam = Number(btn.dataset.uxEvKfCam);
          const viewMode = btn.dataset.uxEvKfView === 'grid' ? 'grid' : 'single';
          openKeyframeEvidenceModal(c, chart, ev, { momentIdx: mIdx, cam, viewMode });
        });
      });
    };

    bindSupportingEvidenceEvents(step2BodyEl.querySelector('#ux-s2-panel-supporting'));

    const toggleRefCardInPlace = (btn, setObj, key) => {
      const cardEl = btn.closest('.ux-ref-card');
      const collapseEl = cardEl?.querySelector(':scope > .ux-collapse');
      const expanded = !(cardEl?.dataset.expanded === 'true');
      if (key) {
        if (expanded) setObj.add(key);
        else setObj.delete(key);
      }
      if (cardEl) cardEl.dataset.expanded = String(expanded);
      btn.setAttribute('aria-expanded', String(expanded));
      if (collapseEl) {
        collapseEl.dataset.open = String(expanded);
        collapseEl.inert = !expanded;
      }
    };

    step2BodyEl.querySelectorAll('[data-ux-ref-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        toggleRefCardInPlace(btn, expandedRefSet, btn.dataset.uxRefToggle);
      });
    });
  };

  const renderStep2 = (c, forceRun = false) => {
    const chart = KNIA_CHART_CATALOG.find((x) => x.code === (c.selectedChart || 'KNIA-205')) || KNIA_CHART_CATALOG[0];
    if (step2WrapEl) step2WrapEl.hidden = false;

    if (c.evidenceAnalysedChart !== chart.code || forceRun) {
      const targetKey = `${c.id}:${chart.code}:live:${forceRun ? Date.now() : 'init'}`;
      if (step2AnalysingEl?.dataset.renderedKey === targetKey && !forceRun) return;
      if (step2AnalysingEl) step2AnalysingEl.dataset.renderedKey = targetKey;
      if (step2BodyEl) {
        step2BodyEl.innerHTML = '';
        step2BodyEl.hidden = true;
      }
      runningStepState[2] = true;
      renderFloatBar(c);
      renderVideoTimeline(c);
      bridge.startStep2Analysis?.(buildStep2AnalysisRecord(c, chart), {
        instantCollapsed: false,
        onRerun: (guidance) => rerunStep2(c, chart, guidance),
        rerunDisabled: Boolean(c.isClosed),
        onComplete: () => {
          runningStepState[2] = false;
          c.evidenceAnalysedChart = chart.code;
          if (step2AnalysingEl) step2AnalysingEl.dataset.renderedKey = `${c.id}:${chart.code}:done`;
          renderStep2Body(c, chart, true);
          renderVideoTimeline(c);
          renderFloatBar(c);
        },
      });
      return;
    }

    runningStepState[2] = false;
    const doneKey = `${c.id}:${chart.code}:done`;
    if (step2AnalysingEl && step2AnalysingEl.dataset.renderedKey !== doneKey) {
      step2AnalysingEl.dataset.renderedKey = doneKey;
      bridge.startStep2Analysis?.(buildStep2AnalysisRecord(c, chart), {
        instantCollapsed: true,
        onRerun: (guidance) => rerunStep2(c, chart, guidance),
        rerunDisabled: Boolean(c.isClosed),
      });
    }
    renderStep2Body(c, chart, false);
    renderFloatBar(c);
  };

  const commitNewReportVersion = (c, resetNegotiation = false) => {
    const chart = KNIA_CHART_CATALOG.find((x) => x.code === (c.selectedChart || 'KNIA-205')) || KNIA_CHART_CATALOG[0];
    const selectedCount = getSelectedEvidenceList(c, chart).length;
    const ver = `v${c.versions.length + 1}`;
    c.versions.push({
      ver,
      chartCode: chart.code,
      baseRatio: chart.baseRatio,
      interpretation: c.interpretation,
      createdAt: nowStamp(),
      eventsCount: selectedCount,
    });
    if (resetNegotiation) {
      c.factors.forEach((f) => {
        if (!f.archivedUnder) f.archivedUnder = `v${c.versions.length - 1}`;
      });
    }
    if (c.stage === 'pending_chart' || c.stage === 'pending_report' || c.stage === 'analyzing') {
      c.stage = 'negotiating';
    }
    logActivity(c.id, 'REPORT', `Confirmed ${ver} (${scenarioLabel(chart)} · ${chart.baseRatio} · ${selectedCount} evidence cues)`, 'Adjuster');
    renderCaseQueueRows();
    selectStep(3);
  };

  // ── Step 3: AI Modifier Reasoning & Upward/Downward Factor Evaluation ──
  const getStep3Signature = (chart, selectedEvidence) =>
    `${chart.code}:${selectedEvidence.map((e, i) => e.id || i).join(',')}`;

  const synthesizeStep3Modifiers = (chart, selectedEvidence) => {
    const label = scenarioLabel(chart);
    const items = [];
    const ev0 = selectedEvidence[0];
    const ev1 = selectedEvidence[1];
    if (ev0) {
      const ev0Rationale = `${formatEvidenceCue(ev0)} on Cam ${ev0.cam} (${label})`;
      items.push({
        id: `f-ai-${Date.now()}-1`,
        side: 'counterparty',
        group: 'Situational',
        title: `Verified ${ev0.title.toLowerCase()}`,
        rationale: ev0Rationale,
        delta: 10,
        status: 'negotiating',
        note: ev0Rationale,
      });
    }
    if (ev1) {
      const oppHeavy = chart.insuredFault >= 50;
      const ev1Rationale = `${formatEvidenceCue(ev1)} on Cam ${ev1.cam}`;
      items.push({
        id: `f-ai-${Date.now()}-2`,
        side: oppHeavy ? 'insured' : 'counterparty',
        group: 'Conduct',
        title: `Corroborated ${ev1.title.toLowerCase()}`,
        rationale: ev1Rationale,
        delta: oppHeavy ? 10 : 5,
        status: 'negotiating',
        note: ev1Rationale,
      });
    }
    const sightlineRationale = `Road geometry & occlusion check for ${label}`;
    items.push({
      id: `f-ai-${Date.now()}-3s`,
      side: 'insured',
      group: 'Situational',
      title: 'Reduced junction sightline window',
      rationale: sightlineRationale,
      delta: 5,
      status: 'negotiating',
      note: sightlineRationale,
    });
    const lookoutRationale = `Standard comparative check for ${label}`;
    items.push({
      id: `f-ai-${Date.now()}-3`,
      side: 'insured',
      group: 'Conduct',
      title: 'Reaction timing & corridor lookout check',
      rationale: lookoutRationale,
      delta: 10,
      status: 'negotiating',
      note: lookoutRationale,
    });
    return items;
  };

  const buildStep3AnalysisRecord = (c, chart, selectedEvidence) => {
    const label = scenarioLabel(chart);
    const guidance = String(c?.rerunGuidance?.[3] || '').trim();
    const activeFactors = (c.factors || []).filter((f) => !f.archivedUnder);
    const mods = activeFactors.length ? activeFactors : synthesizeStep3Modifiers(chart, selectedEvidence);
    const oppMods = mods.filter(isCounterpartyMod);
    const ourMods = mods.filter((m) => !isCounterpartyMod(m));

    return {
      caseId: c.id,
      scenario: chart.title,
      guidance,
      doneGroupLabel: `Reasoned from ${selectedEvidence.length} proof input${selectedEvidence.length === 1 ? '' : 's'} · ${mods.length} modifiers`,
      runningPrefix: 'Evaluating modifiers step',
      liveAnnouncement: `Proposed ${mods.length} fault modifiers for ${label}`,
      steps: [
        {
          id: 's3-map-evidence',
          tool: 'frame-detection',
          title: `Mapped ${selectedEvidence.length} Step 2 cues to modifier rules`,
          runningTitle: 'Scanning selected proof for adjustment triggers',
          durationMs: 2100,
          summary: `${selectedEvidence.length} cues`,
          thinkingSteps: [
            guidance
              ? `Applying adjuster context ("${guidance}") to ${selectedEvidence.length} proof cue(s) under ${label} (${chart.baseRatio})...`
              : `Scanning the ${selectedEvidence.length} selected proof cue(s) under ${label} (${chart.baseRatio}) for additive party fault triggers...`,
            `Matched ${selectedEvidence.map((e) => e.title).join(', ') || chart.title} against KNIA comparative fault rules.`,
          ],
          input: {
            Scenario: `${label} (${chart.baseRatio})`,
            'Selected cues': `${selectedEvidence.length} from Step 2`,
            ...(guidance ? { Guidance: guidance } : {}),
          },
          output: {
            type: 'list',
            items: selectedEvidence.length
              ? selectedEvidence.slice(0, 3).map((ev) => ({
                  lead: formatEvidenceCue(ev),
                  title: ev.title,
                  tag: `Cam ${ev.cam}`,
                }))
              : [{ lead: 'Baseline', title: chart.title, tag: 'Scenario' }],
          },
        },
        {
          id: 's3-score-modifiers',
          tool: 'kinematics-eval',
          title: 'Evaluated Counterparty vs Insured modifiers',
          runningTitle: 'Evaluating additive fault modifiers',
          durationMs: 2300,
          summary: `${oppMods.length} Counterparty · ${ourMods.length} Insured`,
          thinkingSteps: [
            'Scoring additive Counterparty (+%) and Insured (+%) fault modifiers...',
            `Balanced ${oppMods.length} Counterparty modifier(s) and ${ourMods.length} Insured modifier(s) relative to baseline ${chart.baseRatio}.`,
          ],
          input: {
            Counterparty: `${oppMods.length} modifier(s)`,
            Insured: `${ourMods.length} modifier(s)`,
          },
          output: {
            type: 'list',
            items: mods.map((m) => ({
              lead: formatAddPct(m.delta),
              title: m.title,
              tag: modifierPartyLabel(m),
            })),
          },
        },
        {
          id: 's3-propose-list',
          tool: 'knia-engine',
          title: `Prepared ${mods.length} fault adjustment modifiers`,
          runningTitle: 'Preparing additive modifier list',
          durationMs: 2000,
          summary: `${mods.length} modifiers`,
          thinkingSteps: [
            `Finalizing additive modifier list with party allocation and rationale for adjuster review in Step 3...`,
            `Ready: ${mods.length} modifier(s) prepared without altering Step 1 scenario or Step 2 proof selection.`,
          ],
          input: {
            'Base ratio': chart.baseRatio,
            Modifiers: `${mods.length} proposed`,
            ...(guidance ? { Guidance: guidance } : {}),
          },
          output: {
            type: 'table',
            columns: ['Add fault to', 'Type', 'Modifier', 'Points'],
            rows: mods.map((m) => [
              modifierPartyLabel(m),
              isSituationalFactor(m) ? 'Situational' : 'General conduct',
              m.title,
              formatAddPct(m.delta),
            ]),
          },
        },
      ],
    };
  };

  const rerunStep3 = (c, guidance = '') => {
    if (!c || c.isClosed) return;
    const cleanGuidance = String(guidance || '').trim();
    if (cleanGuidance) {
      c.rerunGuidance = { ...(c.rerunGuidance || {}), 3: cleanGuidance };
    }
    c.step3AnalysedKey = null;
    if (step3AnalysingEl) delete step3AnalysingEl.dataset.renderedKey;
    logActivity(c.id, 'NEGO', cleanGuidance ? `Re-ran Step 3 modifier reasoning (${cleanGuidance})` : 'Re-ran Step 3 modifier reasoning', 'Adjuster');
    renderStep3(c, true);
  };

  const KB_STATUSES = ['negotiating', 'agreed', 'excluded'];
  const KB_STATUS_LABELS = {
    negotiating: 'Pending',
    agreed: 'Agreed',
    excluded: 'Excluded',
  };

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.dataset.reducedMotion === 'true';

  const moveNodeAtomically = (targetCol, cardEl, refNode) => {
    if ('moveBefore' in Element.prototype) {
      try {
        targetCol.moveBefore(cardEl, refNode || null);
        return;
      } catch (_) {}
    }
    if (refNode) refNode.before(cardEl);
    else targetCol.append(cardEl);
  };

  let activeVt = null;
  const runWithViewTransition = (fn) => {
    if (typeof document.startViewTransition === 'function' && !prefersReducedMotion()) {
      try {
        activeVt?.skipTransition?.();
        const vt = document.startViewTransition(() => fn());
        activeVt = vt;
        vt?.ready?.catch(() => {});
        vt?.finished?.catch(() => {}).finally(() => {
          if (activeVt === vt) activeVt = null;
        });
        return;
      } catch (_) {
        activeVt = null;
      }
    }
    fn();
  };

  const wireKanbanBoard = (boardEl, { disabled = false, onMove, getLabel } = {}) => {
    if (!boardEl || disabled) return;

    const liveEl = boardEl.querySelector('[data-ux-kb-live]');
    const cardTokens = new WeakMap();
    const bumpCardToken = (el) => {
      const next = (cardTokens.get(el) || 0) + 1;
      cardTokens.set(el, next);
      return next;
    };

    let liveTimer = null;
    const announce = (msg) => {
      if (!liveEl || !msg) return;
      clearTimeout(liveTimer);
      liveEl.textContent = '';
      liveTimer = setTimeout(() => {
        if (boardEl.isConnected) liveEl.textContent = msg;
      }, 350);
    };

    const findScrollContainer = () => {
      let cur = boardEl.parentElement;
      while (cur) {
        const oy = getComputedStyle(cur).overflowY;
        if ((oy === 'auto' || oy === 'scroll') && cur.scrollHeight > cur.clientHeight + 2) return cur;
        cur = cur.parentElement;
      }
      return boardEl.closest('.ds-detail-workspace--primary, .ux-view-scroll');
    };

    const animateFlip = (snapshots, movedCard, fromRect, keepLiftedScale = false) => {
      if (prefersReducedMotion()) return;
      boardEl.querySelectorAll('.ux-mcard').forEach((el) => {
        el.getAnimations().forEach((a) => a.finish());
      });

      snapshots.forEach((prevRect, el) => {
        if (el === movedCard || !el.isConnected) return;
        const curRect = el.getBoundingClientRect();
        const dx = prevRect.left - curRect.left;
        const dy = prevRect.top - curRect.top;
        if (Math.hypot(dx, dy) < 0.5) return;
        el.animate(
          [{ translate: `${dx}px ${dy}px` }, { translate: '0px 0px' }],
          { duration: 200, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
        );
      });

      if (movedCard && fromRect && movedCard.isConnected) {
        const toRect = movedCard.getBoundingClientRect();
        const dx = fromRect.left - toRect.left;
        const dy = fromRect.top - toRect.top;
        if (Math.hypot(dx, dy) < 0.5 && keepLiftedScale) return;
        const token = bumpCardToken(movedCard);
        movedCard.dataset.settling = 'true';
        const keyframes = keepLiftedScale
          ? [{ translate: `${dx}px ${dy}px` }, { translate: '0px 0px' }]
          : [{ translate: `${dx}px ${dy}px`, scale: '1.02', rotate: '1.5deg' }, { translate: '0px 0px', scale: '1', rotate: '0deg' }];
        const anim = movedCard.animate(keyframes, {
          duration: 200,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        });
        anim.finished
          .catch(() => {})
          .finally(() => {
            if (cardTokens.get(movedCard) === token) {
              delete movedCard.dataset.settling;
            }
          });
      }
    };

    const getNextMcard = (node) => {
      let cur = node?.nextElementSibling || null;
      while (cur) {
        if (cur.classList?.contains('ux-mcard')) return cur;
        cur = cur.nextElementSibling;
      }
      return null;
    };

    const insertIntoCol = (col, node, refMcard) => {
      if (!col || !node) return;
      if (refMcard && refMcard.parentElement === col) {
        col.insertBefore(node, refMcard);
        return;
      }
      const emptyEl = col.querySelector(':scope > .ux-kb-empty');
      col.insertBefore(node, emptyEl || null);
    };

    const createPlaceholder = (heightPx, status) => {
      const ph = document.createElement('div');
      ph.className = 'ux-kb-placeholder';
      ph.setAttribute('aria-hidden', 'true');
      ph.dataset.status = status || 'negotiating';
      ph.style.setProperty('--ph-h', `${Math.max(64, Math.round(heightPx))}px`);
      ph.innerHTML = `
        <div class="ux-kb-placeholder__inner">
          <div class="ux-kb-placeholder__row">
            <span class="ux-kb-placeholder__dot"></span>
            <span class="ux-kb-placeholder__bar ux-kb-placeholder__bar--xs"></span>
            <span class="ux-kb-placeholder__bar ux-kb-placeholder__bar--xxs"></span>
          </div>
          <span class="ux-kb-placeholder__bar ux-kb-placeholder__bar--lg"></span>
          <span class="ux-kb-placeholder__bar ux-kb-placeholder__bar--sm"></span>
        </div>
      `;
      return ph;
    };

    const clearDropCols = () => {
      boardEl.querySelectorAll('.ux-kb-col[data-drop-target="true"]').forEach((col) => {
        delete col.dataset.dropTarget;
      });
    };

    const resolveDropTarget = (laneEl, nature, clientX, clientY) => {
      const scopeEl = laneEl || boardEl;
      const laneCols = Array.from(scopeEl.querySelectorAll('.ux-kb-col'));
      if (!laneCols.length) return null;

      let targetCol = document.elementFromPoint(clientX, clientY)?.closest('.ux-kb-col');
      if (targetCol && !scopeEl.contains(targetCol)) targetCol = null;
      if (!targetCol) {
        const laneRect = scopeEl.getBoundingClientRect();
        if (laneRect && clientY >= laneRect.top - 56 && clientY <= laneRect.bottom + 56) {
          let bestDist = Infinity;
          laneCols.forEach((col) => {
            const r = col.getBoundingClientRect();
            if (clientX >= r.left - 12 && clientX <= r.right + 12) {
              const dist = Math.abs(clientX - (r.left + r.right) / 2);
              if (dist < bestDist) {
                bestDist = dist;
                targetCol = col;
              }
            }
          });
        }
      }

      if (!targetCol) return null;

      const siblings = Array.from(targetCol.querySelectorAll('.ux-mcard'));
      let refNode = null;
      for (const sib of siblings) {
        const r = sib.getBoundingClientRect();
        if (clientY < r.top + r.height / 2) {
          refNode = sib;
          break;
        }
      }

      return { col: targetCol, refNode };
    };

    const movePlaceholder = (state, target) => {
      if (!state || !target || !state.placeholderEl) return;
      const ph = state.placeholderEl;
      const curCol = ph.closest('.ux-kb-col');
      const curNext = getNextMcard(ph);
      if (curCol === target.col && curNext === target.refNode) return;

      const snapshots = new Map();
      state.laneEl.querySelectorAll('.ux-mcard').forEach((el) => {
        snapshots.set(el, el.getBoundingClientRect());
      });

      boardEl.querySelectorAll('.ux-kb-col[data-drop-target="true"]').forEach((col) => {
        if (col !== target.col) delete col.dataset.dropTarget;
      });
      target.col.dataset.dropTarget = 'true';
      ph.dataset.status = target.col.dataset.status || 'negotiating';

      insertIntoCol(target.col, ph, target.refNode);

      if (curCol !== target.col && !prefersReducedMotion()) {
        ph.getAnimations().forEach((a) => a.cancel());
        ph.animate(
          [
            { opacity: 0, transform: 'scale(0.96)' },
            { opacity: 1, transform: 'scale(1)' },
          ],
          { duration: 180, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
        );
      }

      animateFlip(snapshots, null, null, false);
    };

    // Keyboard Grab-Move-Drop State
    let kbdState = null;
    let isProgrammaticMove = false;

    const resetKbdUi = (state) => {
      if (!state) return;
      delete state.cardEl.dataset.kbdGrabbed;
    };

    const commitKbdGrab = () => {
      if (!kbdState) return;
      const curCol = kbdState.cardEl.closest('.ux-kb-col');
      const statusLabel = KB_STATUS_LABELS[curCol?.dataset.status || 'negotiating'];
      const title = getLabel?.(kbdState.cardEl) || 'Modifier';
      resetKbdUi(kbdState);
      announce(`Dropped ${title} in ${statusLabel}.`);
      kbdState = null;
    };

    // Pointer Drag State
    let pending = null;
    let activeDrag = null;

    const endPending = () => {
      if (!pending) return;
      document.removeEventListener('pointermove', onPendingMove);
      document.removeEventListener('pointerup', onPendingUp);
      document.removeEventListener('pointercancel', onPendingUp);
      pending = null;
    };

    const finishDrag = (commit, cancelReason = '') => {
      const state = activeDrag;
      if (!state || state.settled) return;
      state.settled = true;
      activeDrag = null;
      if (state.rafId) cancelAnimationFrame(state.rafId);
      if (state.moveRafId) {
        cancelAnimationFrame(state.moveRafId);
        state.moveRafId = 0;
      }

      document.removeEventListener('pointermove', onActiveMove);
      document.removeEventListener('pointerup', onActiveUp);
      document.removeEventListener('pointercancel', onActiveCancel);
      document.removeEventListener('keydown', onActiveKeyDown, true);
      state.captureEl.removeEventListener('lostpointercapture', onLostCapture);

      try {
        if (state.captureEl.hasPointerCapture?.(state.pointerId)) {
          state.captureEl.releasePointerCapture(state.pointerId);
        }
      } catch (_) {}

      const { cardEl, placeholderEl, originCol, originNextSibling, laneEl, scrollEl, startScrollTop } = state;
      const releasedRect = cardEl.getBoundingClientRect();
      const phCol = placeholderEl?.closest('.ux-kb-col') || null;
      const targetCol = commit && phCol ? phCol : originCol;

      const laneCards = laneEl ? Array.from(laneEl.querySelectorAll('.ux-mcard')) : [];
      const snapshots = new Map();
      laneCards.forEach((el) => {
        if (el !== cardEl) snapshots.set(el, el.getBoundingClientRect());
      });

      document.documentElement.classList.remove('ux-kb-dragging');
      delete boardEl.dataset.dragging;
      clearDropCols();
      delete cardEl.dataset.dragging;
      cardEl.style.position = '';
      cardEl.style.left = '';
      cardEl.style.top = '';
      cardEl.style.width = '';
      cardEl.style.margin = '';
      cardEl.style.zIndex = '';
      cardEl.style.translate = '';
      cardEl.style.touchAction = '';
      if (laneEl) delete laneEl.dataset.activeLane;

      if (commit && phCol && placeholderEl?.isConnected) {
        targetCol.insertBefore(cardEl, placeholderEl);
        placeholderEl.remove();
        const moved = targetCol !== originCol || getNextMcard(cardEl) !== originNextSibling;
        if (moved) {
          onMove?.({
            factorId: cardEl.dataset.uxFactor,
            targetStatus: targetCol.dataset.status,
            targetCol,
            cardEl,
            statusChanged: targetCol !== originCol,
          });
          cardEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
          const colCards = Array.from(targetCol.querySelectorAll('.ux-mcard'));
          const pos = colCards.indexOf(cardEl) + 1;
          const label = getLabel?.(cardEl) || 'Modifier';
          announce(`Moved ${label} to ${KB_STATUS_LABELS[targetCol.dataset.status]}, position ${pos} of ${colCards.length}.`);
        }
        animateFlip(snapshots, cardEl, releasedRect, false);
      } else {
        placeholderEl?.remove();
        insertIntoCol(originCol, cardEl, originNextSibling);
        if (scrollEl && scrollEl.scrollTop !== startScrollTop) {
          cardEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
        animateFlip(snapshots, cardEl, releasedRect, false);
        if (cancelReason === 'escape') {
          announce(`Cancelled moving ${getLabel?.(cardEl) || 'Modifier'}.`);
        }
      }
    };

    function onActiveMove(ev) {
      const state = activeDrag;
      if (!state || ev.pointerId !== state.pointerId) return;
      if (!boardEl.isConnected) {
        finishDrag(false);
        return;
      }
      state.lastX = ev.clientX;
      state.lastY = ev.clientY;
      state.cardEl.style.translate = `${ev.clientX - state.startX}px ${ev.clientY - state.startY}px`;
      if (!state.moveRafId) {
        state.moveRafId = requestAnimationFrame(() => {
          state.moveRafId = 0;
          if (!activeDrag || activeDrag !== state || state.settled || !boardEl.isConnected) return;
          const target = resolveDropTarget(state.laneEl, state.nature, state.lastX, state.lastY);
          if (target) movePlaceholder(state, target);
        });
      }
    }

    function onActiveUp(ev) {
      if (!activeDrag || ev.pointerId !== activeDrag.pointerId) return;
      if (activeDrag.moveRafId) {
        cancelAnimationFrame(activeDrag.moveRafId);
        activeDrag.moveRafId = 0;
      }
      activeDrag.lastX = ev.clientX;
      activeDrag.lastY = ev.clientY;
      const target = resolveDropTarget(activeDrag.laneEl, activeDrag.nature, ev.clientX, ev.clientY);
      if (target) movePlaceholder(activeDrag, target);
      finishDrag(true);
    }

    function onActiveCancel(ev) {
      if (!activeDrag || ev.pointerId !== activeDrag.pointerId) return;
      finishDrag(false);
    }

    function onActiveKeyDown(ev) {
      if (!activeDrag || ev.key !== 'Escape') return;
      ev.preventDefault();
      ev.stopPropagation();
      finishDrag(false, 'escape');
    }

    function onLostCapture(ev) {
      if (!activeDrag || ev.pointerId !== activeDrag.pointerId) return;
      finishDrag(false);
    }

    const startActiveDrag = (cfg, ev) => {
      if (kbdState) commitKbdGrab();
      const { cardEl, pointerId, startX, startY } = cfg;
      const originCol = cardEl.closest('.ux-kb-col');
      const laneEl = cardEl.closest('.ux-kb-lane');
      if (!originCol || !laneEl) return;

      const nextSib = getNextMcard(cardEl);
      const scrollEl = findScrollContainer();
      const cardRect = cardEl.getBoundingClientRect();
      const nature = cardEl.dataset.nature;

      bumpCardToken(cardEl);
      cardEl.getAnimations().forEach((a) => a.finish());
      delete cardEl.dataset.settling;

      const placeholderEl = createPlaceholder(cardRect.height, originCol.dataset.status || 'negotiating');
      originCol.insertBefore(placeholderEl, cardEl);

      cardEl.dataset.dragging = 'true';
      cardEl.style.position = 'fixed';
      cardEl.style.left = `${cardRect.left}px`;
      cardEl.style.top = `${cardRect.top}px`;
      cardEl.style.width = `${cardRect.width}px`;
      cardEl.style.margin = '0';
      cardEl.style.zIndex = '60';
      cardEl.style.touchAction = 'none';
      cardEl.style.translate = `${ev.clientX - startX}px ${ev.clientY - startY}px`;
      document.body.appendChild(cardEl);

      const captureEl = boardEl;
      activeDrag = {
        pointerId,
        cardEl,
        placeholderEl,
        captureEl,
        originCol,
        originNextSibling: nextSib,
        laneEl,
        nature,
        scrollEl,
        startScrollTop: scrollEl ? scrollEl.scrollTop : 0,
        startX,
        startY,
        lastX: ev.clientX,
        lastY: ev.clientY,
        cardHeight: Math.max(64, cardRect.height),
        lastFrameTs: performance.now(),
        rafId: 0,
        moveRafId: 0,
        settled: false,
      };

      try {
        captureEl.setPointerCapture?.(pointerId);
      } catch (_) {}

      document.documentElement.classList.add('ux-kb-dragging');
      boardEl.dataset.dragging = 'true';
      laneEl.dataset.activeLane = 'true';
      originCol.dataset.dropTarget = 'true';

      const initialTarget = resolveDropTarget(laneEl, nature, ev.clientX, ev.clientY);
      movePlaceholder(activeDrag, initialTarget);

      document.addEventListener('pointermove', onActiveMove);
      document.addEventListener('pointerup', onActiveUp);
      document.addEventListener('pointercancel', onActiveCancel);
      document.addEventListener('keydown', onActiveKeyDown, true);
      captureEl.addEventListener('lostpointercapture', onLostCapture);

      const tickScroll = (now) => {
        const st = activeDrag;
        if (!st || st.settled || !boardEl.isConnected) return;
        const dt = Math.min(48, Math.max(0, now - st.lastFrameTs)) / 1000;
        st.lastFrameTs = now;
        if (st.scrollEl && dt > 0) {
          const sRect = st.scrollEl.getBoundingClientRect();
          const zone = Math.min(st.cardHeight, sRect.height / 3);
          let velocity = 0;
          if (st.lastY < sRect.top + zone) {
            const ratio = Math.min(1.5, Math.max(0, (sRect.top + zone - st.lastY) / Math.max(1, zone)));
            velocity = -520 * ratio;
          } else if (st.lastY > sRect.bottom - zone) {
            const ratio = Math.min(1.5, Math.max(0, (st.lastY - (sRect.bottom - zone)) / Math.max(1, zone)));
            velocity = 520 * ratio;
          }
          if (velocity !== 0) {
            const prevTop = st.scrollEl.scrollTop;
            st.scrollEl.scrollTop += velocity * dt;
            if (st.scrollEl.scrollTop !== prevTop) {
              const target = resolveDropTarget(st.laneEl, st.nature, st.lastX, st.lastY);
              movePlaceholder(st, target);
            }
          }
        }
        st.rafId = requestAnimationFrame(tickScroll);
      };
      activeDrag.rafId = requestAnimationFrame(tickScroll);
    };

    function onPendingMove(ev) {
      if (!pending || ev.pointerId !== pending.pointerId) return;
      if (Math.hypot(ev.clientX - pending.startX, ev.clientY - pending.startY) >= pending.threshold) {
        const cfg = pending;
        endPending();
        startActiveDrag(cfg, ev);
      }
    }

    function onPendingUp(ev) {
      if (!pending || ev.pointerId !== pending.pointerId) return;
      endPending();
    }

    boardEl.addEventListener('pointerdown', (ev) => {
      if (ev.button !== 0 || activeDrag || pending) return;
      if (ev.target.closest('button, input, textarea, select, a, summary, [contenteditable]')) return;
      const cardEl = ev.target.closest('.ux-mcard');
      if (!cardEl || !boardEl.contains(cardEl)) return;

      pending = {
        cardEl,
        handleEl: null,
        pointerId: ev.pointerId,
        startX: ev.clientX,
        startY: ev.clientY,
        threshold: 5,
      };
      document.addEventListener('pointermove', onPendingMove);
      document.addEventListener('pointerup', onPendingUp);
      document.addEventListener('pointercancel', onPendingUp);
    });

    boardEl.addEventListener('focusin', (ev) => {
      const cardEl = ev.target.closest('.ux-mcard');
      if (!cardEl || activeDrag || isProgrammaticMove) return;
      if (ev.target.matches(':focus-visible') && !cardEl.getAnimations().length) {
        cardEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    });

    boardEl.addEventListener('focusout', (ev) => {
      if (!isProgrammaticMove && kbdState && ev.target === kbdState.handle) {
        commitKbdGrab();
      }
    });

    boardEl.addEventListener('keydown', (ev) => {
      const cardEl = ev.target.classList?.contains('ux-mcard') ? ev.target : null;
      if (!cardEl || !boardEl.contains(cardEl) || activeDrag) return;
      const handle = cardEl;
      const title = getLabel?.(cardEl) || 'Modifier';

      if (ev.key === ' ' || ev.key === 'Enter') {
        ev.preventDefault();
        if (kbdState && kbdState.cardEl === cardEl) {
          commitKbdGrab();
          return;
        }
        if (kbdState) commitKbdGrab();
        const originCol = cardEl.closest('.ux-kb-col');
        if (!originCol) return;
        const originNextSibling = cardEl.nextElementSibling?.classList.contains('ux-mcard') ? cardEl.nextElementSibling : null;
        kbdState = {
          cardEl,
          handle,
          originCol,
          originNextSibling,
          initialStatus: originCol.dataset.status,
        };
        cardEl.dataset.kbdGrabbed = 'true';
        announce(`Grabbed ${title} in ${KB_STATUS_LABELS[originCol.dataset.status]}. Use Left and Right arrows to change column, Up and Down to reorder, Space to drop, Escape to cancel.`);
        return;
      }

      if (!kbdState || kbdState.cardEl !== cardEl) return;

      if (ev.key === 'Escape') {
        ev.preventDefault();
        ev.stopPropagation();
        const st = kbdState;
        const curCol = cardEl.closest('.ux-kb-col');
        const laneEl = cardEl.closest('.ux-kb-lane');
        const snapshots = new Map();
        laneEl?.querySelectorAll('.ux-mcard').forEach((el) => snapshots.set(el, el.getBoundingClientRect()));
        const fromRect = snapshots.get(cardEl);
        const refNode = st.originNextSibling && st.originNextSibling.parentElement === st.originCol ? st.originNextSibling : null;

        isProgrammaticMove = true;
        moveNodeAtomically(st.originCol, cardEl, refNode);
        onMove?.({
          factorId: cardEl.dataset.uxFactor,
          targetStatus: st.initialStatus,
          targetCol: st.originCol,
          cardEl,
          statusChanged: curCol !== st.originCol,
        });
        cardEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        handle.focus({ preventScroll: true });
        isProgrammaticMove = false;

        resetKbdUi(st);
        kbdState = null;
        animateFlip(snapshots, cardEl, fromRect, false);
        announce(`Cancelled moving ${title}.`);
        return;
      }

      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(ev.key)) return;
      ev.preventDefault();

      const curCol = cardEl.closest('.ux-kb-col');
      const laneEl = cardEl.closest('.ux-kb-lane');
      if (!curCol || !laneEl) return;
      const nature = cardEl.dataset.nature;
      const curStatus = curCol.dataset.status;

      let targetCol = curCol;
      let refNode = null;

      if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
        const idx = KB_STATUSES.indexOf(curStatus);
        const nextIdx = ev.key === 'ArrowLeft' ? idx - 1 : idx + 1;
        if (nextIdx < 0 || nextIdx >= KB_STATUSES.length) return;
        targetCol = boardEl.querySelector(`.ux-kb-col[data-nature="${nature}"][data-status="${KB_STATUSES[nextIdx]}"]`);
        if (!targetCol) return;
        refNode = null;
      } else {
        const cards = Array.from(curCol.querySelectorAll('.ux-mcard'));
        const idx = cards.indexOf(cardEl);
        if (ev.key === 'ArrowUp') {
          if (idx <= 0) return;
          refNode = cards[idx - 1];
        } else {
          if (idx === -1 || idx >= cards.length - 1) return;
          refNode = cards[idx + 2] || null;
        }
      }

      const snapshots = new Map();
      laneEl.querySelectorAll('.ux-mcard').forEach((el) => snapshots.set(el, el.getBoundingClientRect()));
      const fromRect = snapshots.get(cardEl);

      isProgrammaticMove = true;
      moveNodeAtomically(targetCol, cardEl, refNode);
      onMove?.({
        factorId: cardEl.dataset.uxFactor,
        targetStatus: targetCol.dataset.status,
        targetCol,
        cardEl,
        statusChanged: targetCol !== curCol,
      });
      cardEl.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      handle.focus({ preventScroll: true });
      isProgrammaticMove = false;

      animateFlip(snapshots, cardEl, fromRect, true);
      const colCards = Array.from(targetCol.querySelectorAll('.ux-mcard'));
      const pos = colCards.indexOf(cardEl) + 1;
      announce(`Moved ${title} to ${KB_STATUS_LABELS[targetCol.dataset.status]}, position ${pos} of ${colCards.length}.`);
    });
  };

  const openScenarioReferenceModal = (c, chart) => {
    const dlg = dialogs.scenarioRef;
    if (!dlg || !chart) return;
    const titleEl = dlg.querySelector('[data-ux-as-ref-title]');
    const descEl = dlg.querySelector('[data-ux-as-ref-desc]');
    const bodyEl = dlg.querySelector('[data-ux-as-ref-body]');
    if (titleEl) titleEl.textContent = scenarioLabel(chart);
    if (descEl) descEl.textContent = chart.title || '';
    if (bodyEl) {
      bodyEl.innerHTML = renderScenarioDetailHtml(chart, true, c?.isClosed, true);
      bodyEl.querySelector('.ux-as-split-track')?.style.setProperty('--ratio-a', String(clampRatioUnit(chart.insuredFault)));
    }
    openDialogSmooth(dlg);
    if (!bodyEl) return;
    mountScenarioSimulations(bodyEl);
    bodyEl.querySelectorAll('[data-ux-replay-sim]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const svg = bodyEl.querySelector(`[data-ux-sim-stage="${btn.dataset.uxReplaySim}"] svg`);
        if (svg) playScenarioSimulation(svg, { force: true });
      });
    });
    bodyEl.querySelectorAll('[data-ux-sim-stage]').forEach((stageEl) => {
      stageEl.addEventListener('click', () => {
        const svg = stageEl.querySelector('svg');
        if (svg) playScenarioSimulation(svg, { force: true });
      });
    });
    bodyEl.querySelectorAll('[data-ux-cond-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const ch = KNIA_CHART_CATALOG.find((x) => x.code === btn.dataset.uxCondChart);
        const cond = ch?.kniaBasis?.find((x) => x.id === btn.dataset.uxCondId);
        if (!ch || !cond) return;
        closeDialogSmooth(dlg);
        jumpToScenarioCondition(c, ch, cond);
      });
    });
  };

  const renderStep3Body = (c, animateReveal = false) => {
    if (!step3BodyEl) return;
    step3BodyEl.hidden = false;

    const chart = KNIA_CHART_CATALOG.find((x) => x.code === (c.selectedChart || 'KNIA-205')) || KNIA_CHART_CATALOG[0];
    const calc = computeNegotiatedRatio(c);
    const activeFactors = c.factors.filter((f) => !f.archivedUnder);
    const archivedFactors = c.factors.filter((f) => Boolean(f.archivedUnder));

    const renderMatrixCardHtml = (f) => {
      const noteOpen = store.openNoteFactorIds.has(f.id);
      const isOppAdd = isCounterpartyMod(f);
      const sideKey = isOppAdd ? 'counterparty' : 'insured';
      const weight = Math.abs(Number(f.delta) || 0);
      const signedLabel = weight === 0 ? '0%' : (isOppAdd ? `-${weight}%` : `+${weight}%`);
      const detailText = f.note ?? f.rationale ?? '';
      return `
        <div class="ux-mcard" role="listitem" tabindex="${c.isClosed ? '-1' : '0'}" data-ux-factor="${esc(f.id)}" data-status="${esc(f.status)}" data-nature="all" data-side="${sideKey}">
          <div class="ux-mcard__top">
            <div class="ux-mcard__meta">
              <span class="ux-mcard__dot ux-mcard__dot--${sideKey}" aria-hidden="true"></span>
              <span class="ux-mcard__party">${isOppAdd ? 'Counterparty' : 'Insured'}</span>
            </div>
            <span class="ux-mcard__weight ux-num" data-ux-fdelta="${esc(f.id)}">${esc(signedLabel)}</span>
          </div>
          <div class="ux-mcard__title">${esc(f.title)}</div>
          <div class="ux-mcard__foot">
            <button type="button" class="ds-button ds-button--ghost ds-button--sm ux-mcard__note-btn" data-ux-toggle-note="${esc(f.id)}" aria-expanded="${noteOpen}">${ICON_DETAILS}<span class="ux-mcard__note-label">Details</span></button>
          </div>
          <div class="ux-collapse ux-mcard__note-wrap" data-open="${noteOpen}" ${noteOpen ? '' : 'inert'}>
            <div class="ux-collapse__inner">
              <div class="ux-mcard__note-inner">
                <textarea class="ds-textarea ux-mcard__note-input" rows="1" placeholder="Enter modifier details..." aria-label="Modifier details" data-ux-factor-note="${esc(f.id)}" ${c.isClosed ? 'disabled' : ''}>${esc(detailText)}</textarea>
              </div>
            </div>
          </div>
        </div>
      `;
    };

    const renderKanbanColHtml = (items, status) => {
      const colItems = items.filter((f) => f.status === status);
      const colLabel = KB_STATUS_LABELS[status] || 'Pending';
      const colIcon = status === 'agreed' ? ICON_KB_AGREED : status === 'excluded' ? ICON_KB_EXCLUDED : ICON_KB_PENDING;
      return `
        <div class="ux-kb-column" data-status="${status}">
          <div class="ux-kb-colhead" data-status="${status}">
            ${colIcon}
            <span>${colLabel}</span>
            <span class="ds-badge ds-badge--pill ds-badge--neutral ux-kb-colhead__count ux-num" data-ux-kb-col-count="${status}">${colItems.length}</span>
          </div>
          <div class="ux-kb-col" role="list" aria-label="Modifiers · ${colLabel}" data-ux-kb-col data-nature="all" data-status="${status}">
            ${colItems.map((f) => renderMatrixCardHtml(f)).join('')}
          </div>
        </div>
      `;
    };

    step3BodyEl.innerHTML = `
      <div class="ux-section${animateReveal ? ' ux-reveal' : ''}">
        <section class="ux-heading-block ux-tug-card" aria-label="Negotiated fault split">
          <div class="ux-heading-block__head">
            <span class="ux-heading-block__kicker ux-num">${esc(scenarioLabel(chart))} · ${esc(chart.title)}</span>
            <button type="button" class="ds-button ds-button--secondary ds-button--sm" data-ux-open-as-ref aria-haspopup="dialog"><span>Scenario reference</span></button>
          </div>
          <div class="ux-split-header">
            <div class="ux-split-side">
              <span class="ux-split-side__num" data-ux-tug-our>${calc.finalOur}%</span>
            </div>
            <div class="ux-split-center">
              <span class="ux-shift-pill ux-num" data-ux-tug-shift data-tone="neutral">At base</span>
            </div>
            <div class="ux-split-side ux-split-side--right">
              <span class="ux-split-side__num" data-ux-tug-opp>${calc.finalOpp}%</span>
            </div>
          </div>
          ${renderSplitBarHtml({
            cls: 'ds-progress-bar ux-split-bar',
            attrs: 'data-ux-tug-bar',
            baseTick: true,
            baseShifted: calc.finalOpp !== calc.baseOpp,
          })}
          <div class="ux-split-legend">
            <span class="ux-split-side__label"><span class="ux-as-dot ux-as-dot--insured" aria-hidden="true"></span><span>Insured</span></span>
            <span class="ux-split-side__label"><span>Counterparty</span><span class="ux-as-dot ux-as-dot--counterparty" aria-hidden="true"></span></span>
          </div>
        </section>

        <section class="ux-info-canvas" aria-label="Modifiers negotiation board">
          <div class="ux-kanban" data-ux-kanban aria-label="Negotiation modifiers board">
            <div class="ux-kb-topbar">
              <div class="ux-canvas-head__title-group">
                <h3 class="ux-title">Modifiers</h3>
                ${archivedFactors.length > 0 ? `<span class="ds-badge ds-badge--pill ds-badge--neutral ux-num">${archivedFactors.length} archived</span>` : ''}
              </div>
              <button type="button" class="ds-button ds-button--secondary" data-ux-open-add-modifier ${c.isClosed ? 'disabled' : ''}>${ICON_PLUS}<span>Add modifier</span></button>
            </div>

            <div class="ux-kb-lane" data-nature="all" data-ux-tier="all">
              <div class="ux-kb-grid">
                ${KB_STATUSES.map((st) => renderKanbanColHtml(activeFactors, st)).join('')}
              </div>
            </div>

            <div class="ds-button__sr-only" role="status" aria-live="polite" aria-atomic="true" data-ux-kb-live></div>
          </div>
        </section>
      </div>
    `;

    step3BodyEl.querySelectorAll('.ux-mcard').forEach((el) => {
      el.style.viewTransitionName = `kb-card-${String(el.dataset.uxFactor || '').replace(/[^a-zA-Z0-9_-]/g, '')}`;
    });

    const syncGaugeLive = () => {
      const next = computeNegotiatedRatio(c);
      const barEl = step3BodyEl.querySelector('[data-ux-tug-bar]');
      const baseTickEl = step3BodyEl.querySelector('[data-ux-tug-base]');
      const oppEl = step3BodyEl.querySelector('[data-ux-tug-opp]');
      const ourEl = step3BodyEl.querySelector('[data-ux-tug-our]');
      const shiftEl = step3BodyEl.querySelector('[data-ux-tug-shift]');

      barEl?.style.setProperty('--ratio-a', String(clampRatioUnit(next.finalOur)));
      baseTickEl?.style.setProperty('--base-a-scale', String(clampRatioUnit(next.baseOur)));
      if (baseTickEl) baseTickEl.dataset.shifted = String(next.finalOpp !== next.baseOpp);

      if (oppEl) oppEl.textContent = `${next.finalOpp}%`;
      if (ourEl) ourEl.textContent = `${next.finalOur}%`;

      if (shiftEl) {
        const netOurShift = next.finalOur - next.baseOur;
        if (netOurShift === 0) {
          shiftEl.textContent = 'At base';
          shiftEl.dataset.tone = 'neutral';
        } else if (netOurShift > 0) {
          shiftEl.textContent = `Insured +${netOurShift}%`;
          shiftEl.dataset.tone = 'blue';
        } else {
          shiftEl.textContent = `Insured ${netOurShift}%`;
          shiftEl.dataset.tone = 'blue';
        }
      }

      const pendCntEl = step3BodyEl.querySelector('[data-ux-kb-col-count="negotiating"]');
      const agreedCntEl = step3BodyEl.querySelector('[data-ux-kb-col-count="agreed"]');
      const exclCntEl = step3BodyEl.querySelector('[data-ux-kb-col-count="excluded"]');
      if (pendCntEl) pendCntEl.textContent = String(next.pendingCount);
      if (agreedCntEl) agreedCntEl.textContent = String(next.agreedCount);
      if (exclCntEl) exclCntEl.textContent = String(next.excludedCount);

      renderFloatBar(c);
      return next;
    };
    syncGaugeLive();
    mountFreshRoot(step3BodyEl);

    const autoSizeNoteFields = (elements) => {
      const list = Array.from(elements || []).filter(Boolean);
      if (!list.length) return;
      list.forEach((el) => { el.style.height = 'auto'; });
      const heights = list.map((el) => Math.max(32, el.scrollHeight));
      list.forEach((el, i) => { el.style.height = `${heights[i]}px`; });
    };
    requestAnimationFrame(() => {
      autoSizeNoteFields(step3BodyEl.querySelectorAll('[data-ux-factor-note]'));
    });

    step3BodyEl.querySelectorAll('[data-ux-toggle-note]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const fid = btn.dataset.uxToggleNote;
        const cardEl = btn.closest('.ux-mcard');
        const noteWrap = cardEl?.querySelector('.ux-mcard__note-wrap');
        const noteInput = noteWrap?.querySelector('[data-ux-factor-note]');
        const nextOpen = !store.openNoteFactorIds.has(fid);
        if (nextOpen) store.openNoteFactorIds.add(fid);
        else store.openNoteFactorIds.delete(fid);
        btn.setAttribute('aria-expanded', String(nextOpen));
        if (noteWrap) {
          noteWrap.dataset.open = String(nextOpen);
          noteWrap.inert = !nextOpen;
        }
        if (nextOpen && noteInput) {
          autoSizeNoteFields([noteInput]);
          requestAnimationFrame(() => {
            autoSizeNoteFields([noteInput]);
            noteInput.focus({ preventScroll: true });
          });
        }
      });
    });

    wireKanbanBoard(step3BodyEl.querySelector('[data-ux-kanban]'), {
      disabled: Boolean(c.isClosed),
      getLabel: (cardEl) => c.factors.find((x) => x.id === cardEl.dataset.uxFactor)?.title || 'Modifier',
      onMove: ({ factorId, targetStatus, cardEl, statusChanged }) => {
        if (c.isClosed) return;
        const f = c.factors.find((x) => x.id === factorId);
        if (!f) return;
        f.status = targetStatus;
        cardEl.dataset.status = targetStatus;

        const orderedIds = Array.from(step3BodyEl.querySelectorAll('.ux-mcard')).map((el) => el.dataset.uxFactor);
        const byId = new Map(c.factors.map((x) => [x.id, x]));
        const archived = c.factors.filter((x) => Boolean(x.archivedUnder));
        const seen = new Set();
        const reordered = [];
        orderedIds.forEach((id) => {
          const item = byId.get(id);
          if (item && !item.archivedUnder && !seen.has(id)) {
            seen.add(id);
            reordered.push(item);
          }
        });
        c.factors.forEach((x) => {
          if (!x.archivedUnder && !seen.has(x.id)) reordered.push(x);
        });
        c.factors = [...reordered, ...archived];

        const nextCalc = syncGaugeLive();
        if (statusChanged) {
          logActivity(c.id, 'NEGO', `Moved "${f.title}" -> ${KB_STATUS_LABELS[targetStatus] || targetStatus} (${nextCalc.text})`, 'Adjuster');
        }
      },
    });

    step3BodyEl.querySelectorAll('[data-ux-factor-note]').forEach((inp) => {
      const syncNote = () => {
        const f = c.factors.find((x) => x.id === inp.dataset.uxFactorNote);
        if (!f) return;
        f.note = inp.value;
        autoSizeNoteFields([inp]);
      };
      inp.addEventListener('input', syncNote);
      inp.addEventListener('change', syncNote);
    });

    step3BodyEl.querySelector('[data-ux-open-add-modifier]')?.addEventListener('click', () => {
      openAddModifierModal(c);
    });
    step3BodyEl.querySelector('[data-ux-open-as-ref]')?.addEventListener('click', () => {
      openScenarioReferenceModal(c, chart);
    });
  };

  const renderStep3 = (c, forceRun = false) => {
    if (c.versions.length === 0 && !c.isClosed) {
      runningStepState[3] = false;
      if (step3WrapEl) step3WrapEl.hidden = true;
      if (step3BodyEl) {
        step3BodyEl.hidden = false;
        step3BodyEl.innerHTML = `
          <div class="ux-section">
            <section class="ux-info-canvas" aria-label="Negotiation prerequisite">
              <div class="ux-empty-card">
                <div class="ds-platform-empty">
                  <strong>Corroborate proof in Step 2 first</strong>
                  <p>Confirm supporting proof and rulings before negotiating fault modifiers.</p>
                </div>
              </div>
            </section>
          </div>
        `;
      }
      bridge.stopStep3Analysis?.();
      renderFloatBar(c);
      return;
    }

    const chart = KNIA_CHART_CATALOG.find((x) => x.code === (c.selectedChart || 'KNIA-205')) || KNIA_CHART_CATALOG[0];
    const selectedEvidence = getSelectedEvidenceList(c, chart);
    const sig = getStep3Signature(chart, selectedEvidence);
    if (step3WrapEl) step3WrapEl.hidden = false;

    if (c.step3AnalysedKey !== sig || forceRun) {
      const targetKey = `${c.id}:${sig}:live:${forceRun ? Date.now() : 'init'}`;
      if (step3AnalysingEl?.dataset.renderedKey === targetKey && !forceRun) return;
      if (step3AnalysingEl) step3AnalysingEl.dataset.renderedKey = targetKey;
      if (step3BodyEl) {
        step3BodyEl.innerHTML = '';
        step3BodyEl.hidden = true;
      }
      runningStepState[3] = true;
      renderFloatBar(c);
      bridge.startStep3Analysis?.(buildStep3AnalysisRecord(c, chart, selectedEvidence), {
        instantCollapsed: false,
        onRerun: (guidance) => rerunStep3(c, guidance),
        rerunDisabled: Boolean(c.isClosed),
        onComplete: () => {
          runningStepState[3] = false;
          if ((c.factors || []).filter((f) => !f.archivedUnder).length === 0) {
            c.factors.push(...synthesizeStep3Modifiers(chart, selectedEvidence));
          }
          c.step3AnalysedKey = sig;
          if (step3AnalysingEl) step3AnalysingEl.dataset.renderedKey = `${c.id}:${sig}:done`;
          renderStep3Body(c, true);
          renderFloatBar(c);
        },
      });
      return;
    }

    runningStepState[3] = false;
    const doneKey = `${c.id}:${sig}:done`;
    if (step3AnalysingEl && step3AnalysingEl.dataset.renderedKey !== doneKey) {
      step3AnalysingEl.dataset.renderedKey = doneKey;
      bridge.startStep3Analysis?.(buildStep3AnalysisRecord(c, chart, selectedEvidence), {
        instantCollapsed: true,
        onRerun: (guidance) => rerunStep3(c, guidance),
        rerunDisabled: Boolean(c.isClosed),
      });
    }
    renderStep3Body(c, false);
    renderFloatBar(c);
  };

  // ── Step 4: Export (Temporary Empty State) ──
  const openCloseCaseModal = (c) => {
    const dlg = dialogs.closeCase;
    if (!dlg || !c || c.isClosed) return;
    openDialogSmooth(dlg);
  };

  const renderStep4 = (c) => {
    const panel = stepPanels[4];
    if (!panel) return;
    const closeDisposition = c.closeReason || 'Mutual settlement';
    panel.innerHTML = `
      <div class="ux-section">
        <section class="ux-info-canvas" aria-label="Export output">
          <div class="ux-canvas-head">
            <div class="ux-canvas-head__title-group">
              <h3 class="ux-canvas-head__title">${c.isClosed ? `Closed · ${esc(closeDisposition)}` : 'Case completion'}</h3>
            </div>
            ${c.isClosed ? `
              <div class="ux-toolbar-group">
                <button type="button" class="ds-button ds-button--secondary" data-ux-reopen-case>Reopen case</button>
              </div>
            ` : ''}
          </div>
          <div class="ux-empty-card">
            <div class="ds-platform-empty">
              <div class="ds-platform-empty__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M3.5 2L3.5 1.25C3.08579 1.25 2.75 1.58579 2.75 2L3.5 2ZM20.5 2H21.25C21.25 1.58579 20.9142 1.25 20.5 1.25V2ZM3.5 22H2.75C2.75 22.1989 2.82902 22.3897 2.96967 22.5303C3.11032 22.671 3.30109 22.75 3.5 22.75V22ZM13.5 22V22.75H13.8107L14.0303 22.5303L13.5 22ZM20.5 15L21.0303 15.5303L21.25 15.3107V15H20.5ZM13.5 15V14.25H12.75V15H13.5ZM3.5 2.75L20.5 2.75V1.25L3.5 1.25L3.5 2.75ZM4.25 22L4.25 2L2.75 2L2.75 22H4.25ZM3.5 22.75H13.5V21.25H3.5V22.75ZM21.25 15V2H19.75V15H21.25ZM14.0303 22.5303L21.0303 15.5303L19.9697 14.4697L12.9697 21.4697L14.0303 22.5303ZM14.25 22V15H12.75V22H14.25ZM13.5 15.75H20.5V14.25H13.5V15.75Z" fill="currentColor"/><path d="M8 7H16" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 11H12" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
              </div>
              <strong>No export data yet</strong>
              <p>Export dossiers and customer notices will appear here once output data is connected.</p>
            </div>
          </div>
        </section>
      </div>
    `;
    panel.querySelector('[data-ux-reopen-case]')?.addEventListener('click', () => reopenCase(c));
    renderFloatBar(c);
  };

  const SWAP_EASE_ENTER = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const SWAP_EASE_STANDARD = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const SWAP_SPRING_MORPH = 'linear(0, 0.0894, 0.2623, 0.4396, 0.5912, 0.71, 0.7985, 0.8622, 0.9069, 0.9377, 0.9587, 0.9728, 0.9822, 0.9884, 0.9925, 0.9951, 1)';
  const SWAP_SPRING_SNAPPY = 'linear(0, 0.0934, 0.272, 0.4527, 0.6053, 0.7233, 0.8101, 0.8717, 0.9144, 0.9435, 0.963, 0.9759, 0.9844, 0.99, 0.9936, 0.9959, 1)';
  const SWAP_DUR_FAST = 150;
  const SWAP_DUR_STANDARD = 200;
  const SWAP_DUR_SNAPPY = 260;
  const SWAP_DUR_MORPH = 380;
  const SWAP_CHAR_STAGGER = 16;
  const SWAP_CHAR_STAGGER_MAX = 120;

  const floatBarCtrl = {
    mounted: false,
    initialized: false,
    lastCaseId: null,
    lastSig: '',
    barEl: null,
    dangerSlotEl: null,
    dangerBtnEl: null,
    contextEl: null,
    leadEl: null,
    pipsEl: null,
    ctaSlotEl: null,
    ctaBtnEl: null,
    ctaIconLeadEl: null,
    ctaIconTrailEl: null,
    liveEl: null,
    slots: null,
    anims: {
      bar: null,
      dangerSlot: null,
      ctaSlot: null,
      ctaBtn: null,
      lead: null,
      pips: null,
      ctaLead: null,
      ctaTrail: null,
    },
  };

  function cancelAnim(anim) {
    if (!anim) return null;
    try { anim.cancel(); } catch {}
    return null;
  }

  function createMorphSlot(hostEl) {
    hostEl.innerHTML = `<span class="ux-float-bar__glyphs"></span><span class="ux-float-bar__glyph-exits" aria-hidden="true"></span>`;
    return {
      hostEl,
      rowEl: hostEl.querySelector('.ux-float-bar__glyphs'),
      exitsEl: hostEl.querySelector('.ux-float-bar__glyph-exits'),
      text: '',
      spans: [],
      settleTimer: 0,
    };
  }

  function ensureFloatBarMounted() {
    if (!floatBarDockEl) return null;
    if (floatBarCtrl.mounted && floatBarDockEl.contains(floatBarCtrl.barEl)) {
      return floatBarCtrl;
    }

    floatBarDockEl.innerHTML = `
      <div class="ux-float-bar" role="region" aria-label="Step actions" data-ux-float-bar data-phase="idle" data-has-danger="false">
        <span class="ux-float-bar__danger-slot" data-ux-fab-danger-slot data-folded="true" aria-hidden="true">
          <button type="button" class="ds-button ds-button--danger ds-button--pill ux-float-bar__danger" data-ux-fab-close disabled>Complete &amp; close</button>
        </span>
        <span class="ux-float-bar__context ux-num" data-ux-fab-context>
          <span class="ux-float-bar__lead" data-ux-fab-lead data-has-content="false" aria-hidden="true"></span>
          <span class="ux-float-bar__morph" data-ux-fab-ctx-text></span>
          <span class="ux-float-bar__pips-slot" data-ux-fab-pips data-has-content="false" aria-hidden="true"></span>
          <span class="ux-float-bar__morph ux-float-bar__suffix" data-ux-fab-ctx-suffix data-has-content="false"></span>
        </span>
        <span class="ux-float-bar__cta-slot" data-ux-fab-cta-slot data-folded="false">
          <button type="button" class="ds-button ds-button--pill ux-float-bar__cta" data-ux-fab-primary>
            <span class="ux-float-bar__cta-icon ux-float-bar__cta-icon--lead" data-ux-fab-icon-lead data-has-content="false" aria-hidden="true"></span>
            <span class="ux-float-bar__morph" data-ux-fab-cta-label></span>
            <span class="ux-float-bar__cta-icon ux-float-bar__cta-icon--trail" data-ux-fab-icon-trail data-has-content="false" aria-hidden="true"></span>
          </button>
        </span>
        <span class="ux-sr-only" role="status" aria-live="polite" data-ux-fab-live></span>
      </div>
    `;

    floatBarCtrl.barEl = floatBarDockEl.querySelector('[data-ux-float-bar]');
    floatBarCtrl.dangerSlotEl = floatBarDockEl.querySelector('[data-ux-fab-danger-slot]');
    floatBarCtrl.dangerBtnEl = floatBarDockEl.querySelector('[data-ux-fab-close]');
    floatBarCtrl.contextEl = floatBarDockEl.querySelector('[data-ux-fab-context]');
    floatBarCtrl.leadEl = floatBarDockEl.querySelector('[data-ux-fab-lead]');
    floatBarCtrl.pipsEl = floatBarDockEl.querySelector('[data-ux-fab-pips]');
    floatBarCtrl.ctaSlotEl = floatBarDockEl.querySelector('[data-ux-fab-cta-slot]');
    floatBarCtrl.ctaBtnEl = floatBarDockEl.querySelector('[data-ux-fab-primary]');
    floatBarCtrl.ctaIconLeadEl = floatBarDockEl.querySelector('[data-ux-fab-icon-lead]');
    floatBarCtrl.ctaIconTrailEl = floatBarDockEl.querySelector('[data-ux-fab-icon-trail]');
    floatBarCtrl.liveEl = floatBarDockEl.querySelector('[data-ux-fab-live]');
    floatBarCtrl.slots = {
      ctxText: createMorphSlot(floatBarDockEl.querySelector('[data-ux-fab-ctx-text]')),
      ctxSuffix: createMorphSlot(floatBarDockEl.querySelector('[data-ux-fab-ctx-suffix]')),
      ctaLabel: createMorphSlot(floatBarDockEl.querySelector('[data-ux-fab-cta-label]')),
    };

    floatBarCtrl.dangerBtnEl?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      if (!btn || btn.disabled || floatBarCtrl.barEl?.dataset.phase === 'working') return;
      openCloseCaseModal(getCase());
    });

    floatBarCtrl.ctaBtnEl?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      if (!btn || btn.disabled || floatBarCtrl.barEl?.dataset.phase === 'working') return;
      const curCase = getCase();
      if (!curCase) return;
      const action = btn.dataset.fabAction;
      const selObj = KNIA_CHART_CATALOG.find((ch) => ch.code === curCase.selectedChart) || null;
      const actChart = selObj || KNIA_CHART_CATALOG[0];

      if (action === 'ask-fix') {
        bridge.setAgentPanelOpen?.(true);
        appendCustomAgentMsg('Resolve paused analysis using impact timestamp 00:12.4', curCase);
      } else if (action === 'next2' && selObj) {
        handleSelectChart(curCase, selObj.code, { forceExpand: true, goToStep2: true });
      } else if (action === 'next3') {
        triggerStep2ToStep3(curCase, actChart);
      } else if (action === 'go-s2') {
        selectStep(2);
      } else if (action === 'next4') {
        if (!curCase.isClosed && curCase.stage !== 'agreed') {
          curCase.stage = 'agreed';
          const nextCalc = computeNegotiatedRatio(curCase);
          logActivity(curCase.id, 'NEGO', `Settled final fault split at ${nextCalc.text}`, 'Adjuster');
          renderCaseQueueRows();
        }
        selectStep(4);
      } else if (action === 'export-pdf') {
        openPdfPreviewModal(curCase, 'Case Dossier Export');
      }
    });

    floatBarCtrl.mounted = true;
    return floatBarCtrl;
  }

  function computeFloatBarModel(c) {
    const step = store.activeStep || 1;
    const selectedObj = KNIA_CHART_CATALOG.find((ch) => ch.code === c.selectedChart) || null;
    const activeChart = selectedObj || KNIA_CHART_CATALOG[0];

    if (runningStepState[step]) {
      const workingLabel = step === 1 ? 'Analyzing scenario' : step === 2 ? 'Checking evidence' : 'Preparing ratio';
      return {
        phase: 'working',
        leadKey: 'spinner',
        leadTone: '',
        leadOur: 0,
        leadHtml: '<span class="ux-float-bar__spinner"></span>',
        ctxText: workingLabel,
        contextTitle: '',
        pips: null,
        ctxSuffix: '',
        ctaVisible: false,
        ctaAction: '',
        ctaDisabled: true,
        ctaLeadIconKey: '',
        ctaLeadIconHtml: '',
        ctaLabel: '',
        ctaTrailIconKey: '',
        ctaTrailIconHtml: '',
      };
    }

    if (step === 1) {
      const isPaused = c.stage === 'undetermined' && !c.lowMatchSimulation;
      if (isPaused) {
        return {
          phase: 'idle',
          leadKey: 'dot',
          leadTone: 'warning',
          leadOur: 0,
          leadHtml: '<span class="ux-float-bar__dot" data-tone="warning"></span>',
          ctxText: 'Paused · Needs input',
          contextTitle: '',
          pips: null,
          ctxSuffix: '',
          ctaVisible: true,
          ctaAction: 'ask-fix',
          ctaDisabled: false,
          ctaLeadIconKey: '',
          ctaLeadIconHtml: '',
          ctaLabel: 'Ask AI',
          ctaTrailIconKey: '',
          ctaTrailIconHtml: '',
        };
      }
      const dotTone = selectedObj ? 'default' : 'warning';
      const contextText = selectedObj ? scenarioLabel(selectedObj) : 'Select scenario';
      return {
        phase: 'idle',
        leadKey: 'dot',
        leadTone: dotTone,
        leadOur: 0,
        leadHtml: `<span class="ux-float-bar__dot" data-tone="${dotTone}"></span>`,
        ctxText: contextText,
        contextTitle: selectedObj ? `${scenarioLabel(selectedObj)} · ${selectedObj.title}` : '',
        pips: null,
        ctxSuffix: '',
        ctaVisible: true,
        ctaAction: 'next2',
        ctaDisabled: !selectedObj,
        ctaLeadIconKey: '',
        ctaLeadIconHtml: '',
        ctaLabel: 'Select',
        ctaTrailIconKey: 'arrow',
        ctaTrailIconHtml: ICON_ARROW_RIGHT,
      };
    }

    if (step === 2) {
      const evList = getEvidenceList(c, activeChart);
      const selectedList = getSelectedEvidenceList(c, activeChart);
      const hasReport = c.versions.length > 0;
      const latest = hasReport ? c.versions[c.versions.length - 1] : null;
      const needConfirm = !hasReport || Boolean(latest && latest.chartCode !== activeChart.code);
      const noEvidenceSelected = evList.length > 0 && selectedList.length === 0;
      const actionDisabled = (c.isClosed && needConfirm) || noEvidenceSelected;
      return {
        phase: 'idle',
        leadKey: noEvidenceSelected ? 'dot' : '',
        leadTone: noEvidenceSelected ? 'warning' : '',
        leadOur: 0,
        leadHtml: noEvidenceSelected ? '<span class="ux-float-bar__dot" data-tone="warning"></span>' : '',
        ctxText: noEvidenceSelected ? 'Select ≥1 evidence' : 'Validate evidence',
        contextTitle: '',
        pips: evList.length ? { total: evList.length, active: selectedList.length } : null,
        ctxSuffix: `${selectedList.length}/${evList.length}`,
        ctaVisible: true,
        ctaAction: 'next3',
        ctaDisabled: actionDisabled,
        ctaLeadIconKey: '',
        ctaLeadIconHtml: '',
        ctaLabel: 'Negotiation',
        ctaTrailIconKey: 'arrow',
        ctaTrailIconHtml: ICON_ARROW_RIGHT,
      };
    }

    if (step === 3) {
      const locked = c.versions.length === 0 && !c.isClosed;
      if (locked) {
        return {
          phase: 'idle',
          leadKey: 'dot',
          leadTone: 'warning',
          leadOur: 0,
          leadHtml: '<span class="ux-float-bar__dot" data-tone="warning"></span>',
          ctxText: 'Validate evidence first',
          contextTitle: '',
          pips: null,
          ctxSuffix: '',
          ctaVisible: true,
          ctaAction: 'go-s2',
          ctaDisabled: false,
          ctaLeadIconKey: '',
          ctaLeadIconHtml: '',
          ctaLabel: 'Validate evidence',
          ctaTrailIconKey: 'arrow',
          ctaTrailIconHtml: ICON_ARROW_RIGHT,
        };
      }
      const calc = computeNegotiatedRatio(c);
      return {
        phase: 'idle',
        leadKey: 'split',
        leadTone: '',
        leadOur: calc.finalOur,
        leadHtml: renderMiniSplitSvg(calc.finalOur),
        ctxText: `Final ${calc.text}`,
        contextTitle: '',
        pips: null,
        ctxSuffix: '',
        ctaVisible: true,
        ctaAction: 'next4',
        ctaDisabled: false,
        ctaLeadIconKey: '',
        ctaLeadIconHtml: '',
        ctaLabel: 'Export',
        ctaTrailIconKey: 'arrow',
        ctaTrailIconHtml: ICON_ARROW_RIGHT,
      };
    }

    const calc = computeNegotiatedRatio(c);
    return {
      phase: 'idle',
      leadKey: 'split',
      leadTone: '',
      leadOur: calc.finalOur,
      leadHtml: renderMiniSplitSvg(calc.finalOur),
      ctxText: `Final ${calc.text}`,
      contextTitle: '',
      pips: null,
      ctxSuffix: '',
      ctaVisible: true,
      ctaAction: 'export-pdf',
      ctaDisabled: false,
      ctaLeadIconKey: 'export',
      ctaLeadIconHtml: ICON_EXPORT_DOC,
      ctaLabel: 'Export PDF',
      ctaTrailIconKey: '',
      ctaTrailIconHtml: '',
    };
  }

  function updateMorphText(slot, nextText, animate) {
    if (!slot) return;
    if (slot.text === nextText) {
      slot.hostEl.dataset.hasContent = String(nextText.length > 0);
      return;
    }

    if (slot.settleTimer) {
      clearTimeout(slot.settleTimer);
      slot.settleTimer = 0;
    }

    const prevChars = Array.from(slot.text);
    const nextChars = Array.from(nextText);
    const { hostEl, rowEl, exitsEl } = slot;

    if (!animate) {
      exitsEl.replaceChildren();
      rowEl.textContent = nextText;
      slot.text = nextText;
      slot.spans = [];
      delete hostEl.dataset.morphing;
      hostEl.dataset.hasContent = String(nextText.length > 0);
      return;
    }

    let start = 0;
    let end = 0;
    while (start < prevChars.length && start < nextChars.length && prevChars[start] === nextChars[start]) start += 1;
    while (
      end < prevChars.length - start
      && end < nextChars.length - start
      && prevChars[prevChars.length - 1 - end] === nextChars[nextChars.length - 1 - end]
    ) {
      end += 1;
    }
    if (start < 2) start = 0;
    if (end < 2) end = 0;

    if (slot.spans.length === 0 && prevChars.length > 0) {
      slot.spans = prevChars.map((ch) => {
        const s = document.createElement('span');
        s.className = 'ux-float-bar__glyph';
        s.textContent = ch;
        return s;
      });
      rowEl.replaceChildren(...slot.spans);
    }
    hostEl.dataset.morphing = 'true';

    exitsEl.replaceChildren();
    const hostRect = hostEl.getBoundingClientRect();
    const keptPrefix = slot.spans.slice(0, start);
    const removedSpans = slot.spans.slice(start, slot.spans.length - end);
    const keptSuffix = end > 0 ? slot.spans.slice(slot.spans.length - end) : [];

    const prevLefts = new Map();
    for (const s of keptPrefix) prevLefts.set(s, s.getBoundingClientRect().left - hostRect.left);
    for (const s of keptSuffix) prevLefts.set(s, s.getBoundingClientRect().left - hostRect.left);

    const exitMeta = removedSpans.map((s) => {
      const r = s.getBoundingClientRect();
      return {
        span: s,
        x: r.left - hostRect.left,
        y: r.top - hostRect.top,
      };
    });

    for (const item of exitMeta) {
      const ex = item.span;
      ex._enterAnim = cancelAnim(ex._enterAnim);
      ex._moveAnim = cancelAnim(ex._moveAnim);
      ex.className = 'ux-float-bar__glyph--exit';
      ex.style.left = `${item.x}px`;
      ex.style.top = `${item.y}px`;
      exitsEl.appendChild(ex);
      if (typeof ex.animate === 'function') {
        const anim = ex.animate(
          [
            { opacity: 1, transform: 'translateY(0px)' },
            { opacity: 0, transform: 'translateY(-3px)' },
          ],
          { duration: SWAP_DUR_FAST, easing: SWAP_EASE_STANDARD, fill: 'forwards' },
        );
        anim.onfinish = () => ex.remove();
      } else {
        ex.remove();
      }
    }

    const middleChars = nextChars.slice(start, nextChars.length - end);
    const insertedSpans = middleChars.map((ch) => {
      const s = document.createElement('span');
      s.className = 'ux-float-bar__glyph';
      s.textContent = ch;
      return s;
    });

    const assembled = [...keptPrefix, ...insertedSpans, ...keptSuffix];
    rowEl.replaceChildren(...assembled);
    slot.text = nextText;
    slot.spans = assembled;
    hostEl.dataset.hasContent = String(nextText.length > 0);

    const leadMs = prevChars.length === 0 ? 100 : 0;
    insertedSpans.forEach((s, order) => {
      if (typeof s.animate !== 'function') return;
      s._enterAnim = cancelAnim(s._enterAnim);
      const delay = leadMs + Math.min(order * SWAP_CHAR_STAGGER, SWAP_CHAR_STAGGER_MAX);
      const anim = s.animate(
        [
          { opacity: 0, transform: 'translateY(4px)' },
          { opacity: 1, transform: 'translateY(0px)' },
        ],
        { duration: SWAP_DUR_STANDARD, delay, easing: SWAP_EASE_ENTER, fill: 'both' },
      );
      s._enterAnim = anim;
      anim.onfinish = () => {
        if (s._enterAnim === anim) s._enterAnim = null;
      };
    });

    const keptAll = [...keptPrefix, ...keptSuffix];
    for (const s of keptAll) {
      s._moveAnim = cancelAnim(s._moveAnim);
    }
    const nextHostLeft = hostEl.getBoundingClientRect().left;
    for (const s of keptAll) {
      const prevLeft = prevLefts.get(s);
      const nextLeft = s.getBoundingClientRect().left - nextHostLeft;
      const dx = prevLeft - nextLeft;
      if (Math.abs(dx) > 0.5 && typeof s.animate === 'function') {
        const anim = s.animate(
          [
            { transform: `translateX(${dx}px)` },
            { transform: 'translateX(0px)' },
          ],
          { duration: SWAP_DUR_MORPH, easing: SWAP_SPRING_MORPH, composite: 'add' },
        );
        s._moveAnim = anim;
        anim.onfinish = () => {
          if (s._moveAnim === anim) s._moveAnim = null;
        };
      }
    }

    const settleDelay = Math.max(SWAP_DUR_MORPH, leadMs + SWAP_CHAR_STAGGER_MAX + SWAP_DUR_STANDARD, SWAP_DUR_FAST) + 40;
    slot.settleTimer = setTimeout(() => {
      slot.settleTimer = 0;
      if (slot.text !== nextText) return;
      exitsEl.replaceChildren();
      rowEl.textContent = nextText;
      slot.spans = [];
      delete hostEl.dataset.morphing;
    }, settleDelay);
  }

  function updateIconSlotDom(slotEl, nextKey, nextHtml, { animate, inPlaceCheck } = {}) {
    if (!slotEl) return;
    if ((slotEl.dataset.slotKey || '') === nextKey) {
      inPlaceCheck?.(slotEl);
      return;
    }

    Array.from(slotEl.querySelectorAll('.ux-swap-layer--exit')).forEach((el) => el.remove());
    const activeLayer = slotEl.querySelector('.ux-swap-layer--active');

    if (animate && activeLayer) {
      activeLayer.classList.remove('ux-swap-layer--active');
      activeLayer.classList.add('ux-swap-layer--exit');
      if (typeof activeLayer.animate === 'function') {
        const anim = activeLayer.animate(
          [
            { opacity: 1, transform: 'translateY(-50%) scale(1)' },
            { opacity: 0, transform: 'translateY(-50%) scale(0.7)' },
          ],
          { duration: SWAP_DUR_FAST, easing: SWAP_EASE_STANDARD, fill: 'forwards' },
        );
        anim.onfinish = () => activeLayer.remove();
      } else {
        activeLayer.remove();
      }
    } else if (activeLayer) {
      activeLayer.remove();
    }

    slotEl.dataset.slotKey = nextKey;
    slotEl.dataset.hasContent = String(Boolean(nextKey));

    if (nextKey) {
      const layer = document.createElement('span');
      layer.className = 'ux-swap-layer ux-swap-layer--active';
      layer.innerHTML = nextHtml;
      slotEl.appendChild(layer);
      if (animate && typeof layer.animate === 'function') {
        layer.animate(
          [
            { transform: 'scale(0.7)' },
            { transform: 'scale(1)' },
          ],
          { duration: SWAP_DUR_SNAPPY, easing: SWAP_SPRING_SNAPPY },
        );
        layer.animate(
          [
            { opacity: 0 },
            { opacity: 1 },
          ],
          { duration: SWAP_DUR_STANDARD, easing: SWAP_EASE_ENTER },
        );
      }
    }
  }

  function updatePipsSlotDom(pipsEl, nextPips) {
    if (!pipsEl) return { changedStructure: false };
    const existingRow = pipsEl.querySelector('.ux-handoff-pips');
    const existingCount = existingRow ? existingRow.children.length : 0;
    const nextTotal = nextPips?.total || 0;

    if (nextTotal > 0 && existingCount === nextTotal) {
      Array.from(existingRow.children).forEach((pip, i) => {
        pip.dataset.on = String(i < nextPips.active);
      });
      pipsEl.dataset.hasContent = 'true';
      return { changedStructure: false };
    }

    if (nextTotal > 0) {
      pipsEl.innerHTML = `<span class="ux-handoff-pips">${Array.from({ length: nextTotal }, (_, i) => `<span class="ux-handoff-pip" data-on="${i < nextPips.active}"></span>`).join('')}</span>`;
      pipsEl.dataset.hasContent = 'true';
    } else {
      pipsEl.replaceChildren();
      pipsEl.dataset.hasContent = 'false';
    }
    return { changedStructure: true };
  }

  function animateSlotWidth(animKey, el, prevW, nextW, opts = {}) {
    floatBarCtrl.anims[animKey] = cancelAnim(floatBarCtrl.anims[animKey]);
    if (!el || typeof el.animate !== 'function') return;
    const { prevOpacity, nextOpacity } = opts;
    if (Math.abs(nextW - prevW) <= 0.5 && prevOpacity === undefined) return;
    const fromKf = { width: `${prevW}px` };
    const toKf = { width: `${nextW}px` };
    if (prevOpacity !== undefined && nextOpacity !== undefined) {
      fromKf.opacity = prevOpacity;
      toKf.opacity = nextOpacity;
    }
    const anim = el.animate([fromKf, toKf], {
      duration: SWAP_DUR_MORPH,
      easing: SWAP_SPRING_MORPH,
    });
    floatBarCtrl.anims[animKey] = anim;
    anim.onfinish = () => {
      if (floatBarCtrl.anims[animKey] === anim) floatBarCtrl.anims[animKey] = null;
    };
  }

  function renderFloatBar(c) {
    if (!floatBarDockEl || !c) return;
    const ctrl = ensureFloatBarMounted();
    if (!ctrl || !ctrl.barEl) return;

    const model = computeFloatBarModel(c);
    const dangerVisible = (store.activeStep || 1) >= 2 && !c.isClosed && model.phase !== 'working';
    const sig = JSON.stringify([
      c.id,
      dangerVisible,
      model.phase,
      model.leadKey,
      model.leadTone,
      model.leadOur,
      model.ctxText,
      model.contextTitle,
      model.pips ? `${model.pips.active}/${model.pips.total}` : '',
      model.ctxSuffix,
      model.ctaVisible,
      model.ctaAction,
      model.ctaDisabled,
      model.ctaLeadIconKey,
      model.ctaLabel,
      model.ctaTrailIconKey,
    ]);
    if (sig === ctrl.lastSig) return;

    const { barEl, dangerSlotEl, dangerBtnEl, contextEl, leadEl, pipsEl, ctaSlotEl, ctaBtnEl, ctaIconLeadEl, ctaIconTrailEl, liveEl, slots } = ctrl;
    const animate = !isReducedMotionPreferred()
      && ctrl.initialized
      && ctrl.lastCaseId === c.id
      && barEl.getBoundingClientRect().width > 0;

    let pre = null;
    if (animate) {
      const barStyle = getComputedStyle(barEl);
      pre = {
        barW: barEl.getBoundingClientRect().width,
        padL: barStyle.paddingLeft,
        padR: barStyle.paddingRight,
        gap: barStyle.columnGap,
        dangerSlotW: dangerSlotEl ? dangerSlotEl.getBoundingClientRect().width : 0,
        dangerSlotOp: dangerSlotEl ? (parseFloat(getComputedStyle(dangerSlotEl).opacity) || 0) : 0,
        dangerVisible: dangerSlotEl ? dangerSlotEl.dataset.folded !== 'true' : false,
        ctaSlotW: ctaSlotEl.getBoundingClientRect().width,
        ctaSlotOp: parseFloat(getComputedStyle(ctaSlotEl).opacity) || 0,
        ctaVisible: ctaSlotEl.dataset.folded !== 'true',
        ctaW: ctaBtnEl.getBoundingClientRect().width,
        leadW: leadEl.getBoundingClientRect().width,
        pipsW: pipsEl.getBoundingClientRect().width,
        pipsOp: parseFloat(getComputedStyle(pipsEl).opacity) || 0,
        pipsVisible: pipsEl.dataset.hasContent === 'true',
        ctaLeadW: ctaIconLeadEl.getBoundingClientRect().width,
        ctaTrailW: ctaIconTrailEl.getBoundingClientRect().width,
      };
      for (const k of Object.keys(ctrl.anims)) {
        ctrl.anims[k] = cancelAnim(ctrl.anims[k]);
      }
    }

    barEl.dataset.phase = model.phase;
    barEl.dataset.hasDanger = String(dangerVisible);
    if (model.phase === 'working') {
      barEl.setAttribute('aria-busy', 'true');
    } else {
      barEl.removeAttribute('aria-busy');
    }

    if (dangerSlotEl && dangerBtnEl) {
      dangerSlotEl.dataset.folded = String(!dangerVisible);
      dangerSlotEl.setAttribute('aria-hidden', String(!dangerVisible));
      dangerBtnEl.disabled = !dangerVisible;
    }

    if (model.contextTitle) {
      contextEl.setAttribute('title', model.contextTitle);
    } else {
      contextEl.removeAttribute('title');
    }

    updateIconSlotDom(leadEl, model.leadKey, model.leadHtml, {
      animate,
      inPlaceCheck: (el) => {
        if (model.leadKey === 'dot') {
          const dot = el.querySelector('.ux-float-bar__dot');
          if (dot && dot.dataset.tone !== model.leadTone) dot.dataset.tone = model.leadTone;
        } else if (model.leadKey === 'split') {
          const activeLayer = el.querySelector('.ux-swap-layer--active');
          if (activeLayer) {
            const tmp = document.createElement('div');
            tmp.innerHTML = model.leadHtml;
            const nextSvg = tmp.firstElementChild;
            const curSvg = activeLayer.firstElementChild;
            if (curSvg && nextSvg) curSvg.innerHTML = nextSvg.innerHTML;
          }
        }
      },
    });

    updateMorphText(slots.ctxText, model.ctxText, animate);
    const pipsInfo = updatePipsSlotDom(pipsEl, model.pips);
    updateMorphText(slots.ctxSuffix, model.ctxSuffix, animate);

    ctaSlotEl.dataset.folded = String(!model.ctaVisible);
    ctaSlotEl.setAttribute('aria-hidden', String(!model.ctaVisible));
    ctaBtnEl.disabled = Boolean(model.ctaDisabled || !model.ctaVisible);
    if (model.ctaAction) {
      ctaBtnEl.dataset.fabAction = model.ctaAction;
    } else {
      delete ctaBtnEl.dataset.fabAction;
    }
    if (model.ctaVisible && model.ctaLabel) {
      ctaBtnEl.setAttribute('aria-label', model.ctaLabel);
    } else {
      ctaBtnEl.removeAttribute('aria-label');
    }

    updateIconSlotDom(ctaIconLeadEl, model.ctaLeadIconKey, model.ctaLeadIconHtml, { animate });
    updateMorphText(slots.ctaLabel, model.ctaLabel, animate);
    updateIconSlotDom(ctaIconTrailEl, model.ctaTrailIconKey, model.ctaTrailIconHtml, { animate });

    if (liveEl) {
      liveEl.textContent = model.ctaVisible ? `${model.ctxText} ${model.ctaLabel}`.trim() : model.ctxText;
    }

    if (animate && pre) {
      const nextBarStyle = getComputedStyle(barEl);
      const nextBarW = barEl.getBoundingClientRect().width;
      const nextDangerSlotW = dangerSlotEl ? dangerSlotEl.getBoundingClientRect().width : 0;
      const nextCtaSlotW = ctaSlotEl.getBoundingClientRect().width;
      const nextCtaW = ctaBtnEl.getBoundingClientRect().width;
      const nextLeadW = leadEl.getBoundingClientRect().width;
      const nextPipsW = pipsEl.getBoundingClientRect().width;
      const nextCtaLeadW = ctaIconLeadEl.getBoundingClientRect().width;
      const nextCtaTrailW = ctaIconTrailEl.getBoundingClientRect().width;

      if (dangerSlotEl && pre.dangerVisible !== dangerVisible && typeof dangerSlotEl.animate === 'function') {
        const dAnim = dangerSlotEl.animate(
          [
            {
              width: `${pre.dangerSlotW}px`,
              opacity: pre.dangerSlotOp,
              transform: pre.dangerVisible ? 'scale(1)' : 'scale(0.92)',
            },
            {
              width: `${nextDangerSlotW}px`,
              opacity: dangerVisible ? 1 : 0,
              transform: dangerVisible ? 'scale(1)' : 'scale(0.92)',
            },
          ],
          { duration: SWAP_DUR_MORPH, easing: SWAP_SPRING_MORPH },
        );
        ctrl.anims.dangerSlot = dAnim;
        dAnim.onfinish = () => {
          if (ctrl.anims.dangerSlot === dAnim) ctrl.anims.dangerSlot = null;
        };
      }

      animateSlotWidth('lead', leadEl, pre.leadW, nextLeadW);
      if (pipsInfo.changedStructure) {
        const nextPipsVisible = Boolean(model.pips && model.pips.total > 0);
        animateSlotWidth('pips', pipsEl, pre.pipsW, nextPipsW, {
          prevOpacity: pre.pipsOp,
          nextOpacity: nextPipsVisible ? 1 : 0,
        });
      }
      animateSlotWidth('ctaLead', ctaIconLeadEl, pre.ctaLeadW, nextCtaLeadW);
      animateSlotWidth('ctaTrail', ctaIconTrailEl, pre.ctaTrailW, nextCtaTrailW);

      if (pre.ctaVisible !== model.ctaVisible && typeof ctaSlotEl.animate === 'function') {
        const foldAnim = ctaSlotEl.animate(
          [
            {
              width: `${pre.ctaSlotW}px`,
              opacity: pre.ctaSlotOp,
              transform: pre.ctaVisible ? 'scale(1)' : 'scale(0.92)',
            },
            {
              width: `${nextCtaSlotW}px`,
              opacity: model.ctaVisible ? 1 : 0,
              transform: model.ctaVisible ? 'scale(1)' : 'scale(0.92)',
            },
          ],
          { duration: SWAP_DUR_MORPH, easing: SWAP_SPRING_MORPH },
        );
        ctrl.anims.ctaSlot = foldAnim;
        foldAnim.onfinish = () => {
          if (ctrl.anims.ctaSlot === foldAnim) ctrl.anims.ctaSlot = null;
        };
      } else if (model.ctaVisible && Math.abs(nextCtaW - pre.ctaW) > 0.5 && typeof ctaBtnEl.animate === 'function') {
        const btnAnim = ctaBtnEl.animate(
          [{ width: `${pre.ctaW}px` }, { width: `${nextCtaW}px` }],
          { duration: SWAP_DUR_MORPH, easing: SWAP_SPRING_MORPH },
        );
        ctrl.anims.ctaBtn = btnAnim;
        btnAnim.onfinish = () => {
          if (ctrl.anims.ctaBtn === btnAnim) ctrl.anims.ctaBtn = null;
        };
      }

      const barChanged = Math.abs(nextBarW - pre.barW) > 0.5
        || pre.padL !== nextBarStyle.paddingLeft
        || pre.padR !== nextBarStyle.paddingRight
        || pre.gap !== nextBarStyle.columnGap;
      if (barChanged && typeof barEl.animate === 'function') {
        const barAnim = barEl.animate(
          [
            {
              width: `${pre.barW}px`,
              paddingLeft: pre.padL,
              paddingRight: pre.padR,
              columnGap: pre.gap,
            },
            {
              width: `${nextBarW}px`,
              paddingLeft: nextBarStyle.paddingLeft,
              paddingRight: nextBarStyle.paddingRight,
              columnGap: nextBarStyle.columnGap,
            },
          ],
          { duration: SWAP_DUR_MORPH, easing: SWAP_SPRING_MORPH },
        );
        ctrl.anims.bar = barAnim;
        barAnim.onfinish = () => {
          if (ctrl.anims.bar === barAnim) ctrl.anims.bar = null;
        };
      }
    }

    ctrl.initialized = true;
    ctrl.lastCaseId = c.id;
    ctrl.lastSig = sig;
  }

  const renderCurrentStepContent = (stepNum) => {
    const c = getCase();
    renderBanners(c);
    renderVideoTimeline(c);
    if (stepNum === 1) renderStep1(c, false);
    else if (stepNum === 2) renderStep2(c);
    else if (stepNum === 3) renderStep3(c);
    else if (stepNum === 4) renderStep4(c);
    renderFloatBar(c);
  };

  const selectStep = (stepNum) => {
    const c = getCase();
    if ((stepNum === 3 || stepNum === 4) && c && c.versions.length === 0 && !c.isClosed) return;
    const prevStep = store.activeStep;
    if (prevStep === 1 && stepNum !== 1 && !c.analysisDone) {
      runningStepState[1] = false;
      bridge.stopCaseAnalysis();
      if (analysingEl) delete analysingEl.dataset.renderedKey;
      if (stepNum >= 2 && c.selectedChart && c.stage !== 'undetermined') {
        c.analysisDone = true;
      }
    }
    if (prevStep === 2 && stepNum !== 2 && c.evidenceAnalysedChart !== (c.selectedChart || 'KNIA-205')) {
      runningStepState[2] = false;
      bridge.stopStep2Analysis?.();
      if (step2AnalysingEl) delete step2AnalysingEl.dataset.renderedKey;
    }
    if (prevStep === 3 && stepNum !== 3) {
      const ch = KNIA_CHART_CATALOG.find((x) => x.code === (c.selectedChart || 'KNIA-205')) || KNIA_CHART_CATALOG[0];
      const sig = getStep3Signature(ch, getSelectedEvidenceList(c, ch));
      if (c.step3AnalysedKey !== sig) {
        runningStepState[3] = false;
        bridge.stopStep3Analysis?.();
        if (step3AnalysingEl) delete step3AnalysingEl.dataset.renderedKey;
      }
    }
    if (prevStep !== stepNum) {
      hideCondThumbTip();
      if (store.evidenceDraft) {
        store.evidenceDraft = null;
        bridge.setTimelineDraftMode?.(false);
      }
      closeStep1ReanalyseSheet({ discardDraft: false });
      store.activeStep2EvidenceTag = null;
      if (store.activeTimelineRange) {
        store.activeTimelineRange = null;
        bridge.setTimelineFocusRange?.(null);
      }
      if (store.activeConditionTarget) {
        store.activeConditionTarget = null;
        renderStageOverlay(null);
      }
    }
    if (stepNum >= 2 && c && c.stage !== 'undetermined') {
      if (!c.selectedChart) {
        const fallbackCode = getTopConfidenceChartCode(c) || 'KNIA-205';
        const fallbackCh = KNIA_CHART_CATALOG.find((x) => x.code === fallbackCode) || KNIA_CHART_CATALOG[0];
        if (fallbackCh) {
          c.selectedChart = fallbackCh.code;
          c.baseRatio = fallbackCh.baseRatio;
          c.baseInsuredPct = fallbackCh.insuredFault;
          c.baseOpponentPct = fallbackCh.counterpartyFault;
        }
      }
      c.analysisDone = true;
    }
    store.activeStep = stepNum;
    if (c?.id) store.furthestStepByCase[c.id] = Math.max(getFurthestStep(c), stepNum);
    syncStepperUI(c);
    Object.entries(stepPanels).forEach(([k, panel]) => {
      if (panel) panel.hidden = Number(k) !== stepNum;
    });
    if (prevStep !== stepNum) {
      const primaryScrollEl = document.querySelector('.ds-detail-workspace--primary');
      if (primaryScrollEl) primaryScrollEl.scrollTop = 0;
    }
    renderCurrentStepContent(stepNum);
  };

  const isStepElDisabled = (rootEl, stepEl) => Boolean(
    !stepEl
    || rootEl?.dataset.disabled === 'true'
    || rootEl?.hasAttribute('data-disabled')
    || stepEl.hasAttribute('disabled')
    || stepEl.dataset.locked === 'true'
    || stepEl.getAttribute('aria-disabled') === 'true'
  );

  stepperEl?.addEventListener('click', (e) => {
    const stepEl = e.target.closest('.ds-progress-step[data-ux-step]');
    if (!stepEl) return;
    const rootEl = stepperEl.querySelector('[data-ds-progress-indicator]');
    if (isStepElDisabled(rootEl, stepEl)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    e.stopPropagation();
    stepEl.blur();
    const nextStep = Number(stepEl.dataset.uxStep);
    if (!nextStep) return;
    if (nextStep !== store.activeStep) {
      selectStep(nextStep);
    } else {
      syncStepperUI(getCase());
    }
  }, { capture: true });

  stepperEl?.addEventListener('keydown', (e) => {
    const stepEl = e.target.closest('.ds-progress-step[data-ux-step]');
    if (!stepEl) return;
    const rootEl = stepperEl.querySelector('[data-ds-progress-indicator]');
    if (rootEl?.dataset.disabled === 'true' || rootEl?.hasAttribute('data-disabled')) return;
    if ((e.key === 'Enter' || e.key === ' ') && isStepElDisabled(rootEl, stepEl)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const steps = Array.from(stepperEl.querySelectorAll('.ds-progress-step[data-ux-step]'))
      .filter((el) => !isStepElDisabled(rootEl, el));
    const idx = steps.indexOf(stepEl);
    if (idx < 0) return;

    let targetIdx = null;
    if (e.key === 'Enter' || e.key === ' ') {
      targetIdx = idx;
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      targetIdx = Math.min(steps.length - 1, idx + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      targetIdx = Math.max(0, idx - 1);
    } else if (e.key === 'Home') {
      targetIdx = 0;
    } else if (e.key === 'End') {
      targetIdx = steps.length - 1;
    }
    if (targetIdx === null) return;

    e.preventDefault();
    e.stopPropagation();
    if (targetIdx !== idx) steps[targetIdx].focus();
    const nextStep = Number(steps[targetIdx].dataset.uxStep);
    if (nextStep !== store.activeStep) {
      selectStep(nextStep);
    } else {
      syncStepperUI(getCase());
    }
  }, { capture: true });

  stepperEl?.addEventListener('stepchange', (e) => {
    const nextStep = Number(e.detail?.step);
    if (!nextStep) return;
    const rootEl = stepperEl.querySelector('[data-ds-progress-indicator]');
    const targetEl = stepperEl.querySelector(`.ds-progress-step[data-ux-step="${nextStep}"]`);
    if (isStepElDisabled(rootEl, targetEl)) {
      syncStepperUI(getCase());
      return;
    }
    if (nextStep !== store.activeStep) {
      selectStep(nextStep);
    } else {
      syncStepperUI(getCase());
    }
  });

  const reopenCase = (c) => {
    if (!c) return;
    c.isClosed = false;
    c.stage = c.versions.length ? 'negotiating' : 'pending_chart';
    logActivity(c.id, 'OTHER', `Reopened case (prev: ${c.closeReason || 'Mutual settlement'})`, 'Adjuster');
    syncCaseClosedControls(c);
    renderCaseQueueRows();
    renderBanners(c);
    selectStep(store.activeStep);
  };

  // ── Modals Wiring ──
  const wireAllModals = () => {
    const createDlg = dialogs.createCase;
    const newCaseState = {
      slots: [
        { slot: 1, label: 'Front dashcam', file: null, valid: true, error: '' },
        { slot: 2, label: 'Rear camera', file: null, valid: true, error: '' },
        { slot: 3, label: 'Counterparty cam', file: null, valid: true, error: '' },
        { slot: 4, label: 'Intersection CCTV', file: null, valid: true, error: '' },
      ],
      policyVerified: false,
      accidentDate: '2026-11-18',
      accidentHour: '09',
      accidentMinute: '30',
      draftAccidentDate: '2026-11-18',
      draftAccidentHour: '09',
      draftAccidentMinute: '30',
      summaryState: 'idle',
      summaryTimer: null,
    };

    const summaryBoxEl = createDlg?.querySelector('[data-ux-cc-summary-box]');
    const summaryInputEl = createDlg?.querySelector('#ux-cc-summary');
    const summaryDoneBtn = createDlg?.querySelector('[data-ux-cc-summary-done]');
    const summaryAnalyzingEl = createDlg?.querySelector('[data-ux-cc-summary-analyzing]');
    const summaryAnalyzingTextEl = createDlg?.querySelector('[data-ux-cc-summary-analyzing-text]');

    const autoSizeSummaryTextarea = () => {
      if (!summaryInputEl) return;
      summaryInputEl.style.height = 'auto';
      const nextH = Math.max(40, summaryInputEl.scrollHeight || 40);
      summaryInputEl.style.height = `${nextH}px`;
    };

    const renderSummaryState = (state, { analyzingText = 'AI analyzing clip...' } = {}) => {
      newCaseState.summaryState = state;
      if (summaryBoxEl) summaryBoxEl.dataset.aiState = state;
      if (summaryAnalyzingTextEl) summaryAnalyzingTextEl.textContent = analyzingText;
      if (summaryAnalyzingEl) summaryAnalyzingEl.hidden = state !== 'analyzing';
      if (summaryDoneBtn) {
        const showDone = state === 'ready' || state === 'done';
        summaryDoneBtn.hidden = !showDone;
        summaryDoneBtn.setAttribute('aria-pressed', String(state === 'done'));
      }
    };

    const buildAiSummaryFromSlots = (slots) => {
      const hasFront = slots.some((s) => s.slot === 1);
      const hasRear = slots.some((s) => s.slot === 2);
      const hasCounter = slots.some((s) => s.slot === 3);
      const hasCctv = slots.some((s) => s.slot === 4);
      const clauses = [];
      if (hasFront) clauses.push('Front dashcam shows insured entering intersection cleanly on solid green phase');
      if (hasCounter) clauses.push('Counterparty cam captures cross-traffic late red entry before impact');
      if (hasCctv) clauses.push('Intersection CCTV corroborates broadside lane trajectories and signal timing');
      if (hasRear) clauses.push('Rear camera confirms normal trailing clearance prior to collision');
      return clauses.length ? `${clauses.join('. ')}.` : '';
    };

    const triggerCreateSummaryAnalysis = (changedSlotNo) => {
      if (newCaseState.summaryTimer) {
        window.clearTimeout(newCaseState.summaryTimer);
        newCaseState.summaryTimer = null;
      }
      const validSlots = newCaseState.slots.filter((s) => s.file && s.valid);
      if (validSlots.length === 0) {
        if (summaryInputEl) summaryInputEl.value = '';
        autoSizeSummaryTextarea();
        renderSummaryState('idle');
        return;
      }
      const targetSlot = newCaseState.slots.find((s) => s.slot === changedSlotNo);
      const analyzingLabel = targetSlot?.file
        ? `AI analyzing ${targetSlot.label}...`
        : `AI analyzing ${validSlots.length} clip${validSlots.length === 1 ? '' : 's'}...`;
      renderSummaryState('analyzing', { analyzingText: analyzingLabel });
      newCaseState.summaryTimer = window.setTimeout(() => {
        newCaseState.summaryTimer = null;
        const latestValid = newCaseState.slots.filter((s) => s.file && s.valid);
        if (latestValid.length === 0) {
          renderSummaryState('idle');
          return;
        }
        if (summaryInputEl) {
          summaryInputEl.value = buildAiSummaryFromSlots(latestValid);
          autoSizeSummaryTextarea();
          summaryInputEl.dataset.justGenerated = 'true';
          window.setTimeout(() => {
            if (summaryInputEl) delete summaryInputEl.dataset.justGenerated;
          }, 220);
        }
        renderSummaryState('ready');
      }, 750);
    };

    summaryInputEl?.addEventListener('input', () => {
      autoSizeSummaryTextarea();
      if (newCaseState.summaryState === 'analyzing') return;
      if (summaryInputEl.value.trim()) {
        if (newCaseState.summaryState === 'done' || newCaseState.summaryState === 'idle') {
          renderSummaryState('ready');
        }
      } else {
        renderSummaryState('idle');
      }
    });

    summaryDoneBtn?.addEventListener('click', () => {
      if (!summaryInputEl?.value.trim()) return;
      renderSummaryState('done');
      summaryInputEl.blur();
    });

    const resetNewCaseSlots = () => {
      if (newCaseState.summaryTimer) {
        window.clearTimeout(newCaseState.summaryTimer);
        newCaseState.summaryTimer = null;
      }
      newCaseState.slots.forEach((s) => {
        s.file = null;
        s.valid = true;
        s.error = '';
      });
      if (summaryInputEl) {
        summaryInputEl.value = '';
        delete summaryInputEl.dataset.justGenerated;
        autoSizeSummaryTextarea();
      }
      renderSummaryState('idle');
    };

    const ICON_VERIFY_OK = '<svg class="ux-verify-btn__svg" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.44242 15.6382L18.3058 5.5L19.7525 6.88095L8.4757 18.4999L4.25195 14.2762L5.66617 12.862L8.44242 15.6382Z" fill="currentColor"/></svg>';
    const ICON_VERIFY_ERR = '<svg class="ux-verify-btn__svg" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 10.2623L18.0123 4.25L19.75 5.98775L13.7377 12L19.75 18.0123L18.0123 19.75L12 13.7377L5.98775 19.75L4.25 18.0123L10.2623 12L4.25 5.98775L5.98775 4.25L12 10.2623Z" fill="currentColor"/></svg>';
    const VERIFY_LABELS = { idle: 'Verify', pending: 'Verifying', verified: 'Verified', error: 'Not found' };
    const VERIFY_SPRING_EASING = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timing-function', 'linear(0, 1)')
      ? 'linear(0,.0213,.0739,.1443,.2235,.305,.3849,.4606,.5305,.594,.6508,.7011,.7452,.7836,.8168,.8454,.8699,.8907,.9084,.9234,.9361,.9467,.9557,.9632,.9694,.9747,.979,.9826,.9857,.9882,.9902,.992,.9934,.9946,.9955,.9963,1)'
      : 'cubic-bezier(0.22, 1, 0.36, 1)';

    const verifyBtn = createDlg?.querySelector('[data-ux-lookup-policy]');
    const verifySrEl = createDlg?.querySelector('[data-ux-verify-sr]');
    const verifyTrackEl = verifyBtn?.querySelector('.ux-verify-btn__track');
    const verifyIconSlotEl = verifyBtn?.querySelector('.ux-verify-btn__icon-slot');
    const verifyMorphEl = verifyBtn?.querySelector('.ux-verify-btn__morph');
    let policyVerifyState = verifyBtn?.dataset.state || 'idle';
    let policyVerifyTimer = 0;
    let policyTrackAnim = null;

    const isVerifyReducedMotion = () => (
      (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      || Boolean(verifyBtn?.closest?.('[data-reduced-motion="true"]'))
    );

    const buildVerifyPhase = (state, reduced) => {
      const wrap = document.createElement('span');
      wrap.className = 'ux-verify-btn__phase';
      wrap.dataset.phase = state;
      if (state === 'pending') {
        wrap.innerHTML = '<span class="ds-button__action-spinner" aria-hidden="true"></span>';
      } else if (state === 'verified') {
        wrap.innerHTML = ICON_VERIFY_OK;
      } else if (state === 'error') {
        wrap.innerHTML = ICON_VERIFY_ERR;
      }
      if (!reduced && state !== 'idle') {
        wrap.animate(
          [
            { opacity: 0, transform: 'scale(0.6)', filter: 'blur(2px)' },
            { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
          ],
          { duration: 200, easing: VERIFY_SPRING_EASING }
        );
      }
      return wrap;
    };

    const setPolicyButtonState = (nextState, { immediate = false } = {}) => {
      if (!verifyBtn) return;
      if (nextState === policyVerifyState) return;
      policyVerifyState = nextState;

      const reduced = immediate || isVerifyReducedMotion();
      const nextText = VERIFY_LABELS[nextState] || VERIFY_LABELS.idle;
      const hasIcon = nextState !== 'idle';

      verifyBtn.dataset.state = nextState;
      verifyBtn.setAttribute('aria-busy', String(nextState === 'pending'));
      if (nextState === 'pending') verifyBtn.setAttribute('aria-disabled', 'true');
      else verifyBtn.removeAttribute('aria-disabled');
      if (verifySrEl) verifySrEl.textContent = nextState === 'idle' ? '' : nextText;

      const prevWidth = !reduced && verifyTrackEl ? verifyTrackEl.getBoundingClientRect().width : 0;

      if (verifyMorphEl) {
        verifyMorphEl.querySelectorAll('.ux-verify-btn__label:not([data-exiting])').forEach((oldLabel) => {
          if (reduced) {
            oldLabel.remove();
            return;
          }
          oldLabel.dataset.exiting = 'true';
          oldLabel.classList.add('ux-verify-btn__label--exiting');
          oldLabel.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration: 100, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
          ).onfinish = () => oldLabel.remove();
        });
        const nextLabel = document.createElement('span');
        nextLabel.className = 'ux-verify-btn__label';
        nextLabel.textContent = nextText;
        verifyMorphEl.appendChild(nextLabel);

        if (!reduced) {
          nextLabel.animate(
            [{ opacity: 0, transform: 'translateY(2px)' }, { opacity: 1, transform: 'translateY(0px)' }],
            { duration: 150, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
          );
        }
      }

      if (verifyIconSlotEl) {
        verifyIconSlotEl.dataset.hasIcon = hasIcon ? 'true' : 'false';
        verifyIconSlotEl.querySelectorAll('.ux-verify-btn__phase:not([data-exiting])').forEach((oldPhase) => {
          if (reduced || !hasIcon) {
            oldPhase.remove();
            return;
          }
          oldPhase.dataset.exiting = 'true';
          oldPhase.animate(
            [
              { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
              { opacity: 0, transform: 'scale(0.6)', filter: 'blur(2px)' },
            ],
            { duration: 140, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
          ).onfinish = () => oldPhase.remove();
        });
        if (hasIcon) {
          verifyIconSlotEl.appendChild(buildVerifyPhase(nextState, reduced));
        }
      }

      if (verifyTrackEl) {
        if (policyTrackAnim) {
          policyTrackAnim.cancel();
          policyTrackAnim = null;
        }
        verifyTrackEl.style.removeProperty('width');
        const nextWidth = verifyTrackEl.getBoundingClientRect().width;
        if (!reduced && prevWidth > 0 && Math.abs(prevWidth - nextWidth) > 0.5) {
          if (verifyMorphEl) verifyMorphEl.dataset.morphing = 'true';
          verifyTrackEl.style.setProperty('width', `${prevWidth}px`);
          void verifyTrackEl.offsetWidth;
          const anim = verifyTrackEl.animate(
            [{ width: `${prevWidth}px` }, { width: `${nextWidth}px` }],
            { duration: 280, easing: VERIFY_SPRING_EASING, fill: 'forwards' }
          );
          policyTrackAnim = anim;
          anim.onfinish = () => {
            if (policyTrackAnim === anim) policyTrackAnim = null;
            anim.cancel();
            verifyTrackEl.style.removeProperty('width');
            if (verifyMorphEl) delete verifyMorphEl.dataset.morphing;
          };
        } else if (verifyMorphEl) {
          delete verifyMorphEl.dataset.morphing;
        }
      }
    };

    const resetPolicyVerify = ({ immediate = false } = {}) => {
      if (policyVerifyTimer) {
        window.clearTimeout(policyVerifyTimer);
        policyVerifyTimer = 0;
      }
      setPolicyButtonState('idle', { immediate });
    };

    const resolvePolicyLookup = () => {
      const policyEl = createDlg?.querySelector('#ux-cc-policy');
      const customerEl = createDlg?.querySelector('#ux-cc-customer');
      const plateEl = createDlg?.querySelector('#ux-cc-plate');
      const rawPol = policyEl?.value.trim() || '';
      const found = POLICY_DIRECTORY[rawPol] || POLICY_DIRECTORY[rawPol.toUpperCase()];
      if (found) {
        if (policyEl) policyEl.value = POLICY_DIRECTORY[rawPol] ? rawPol : rawPol.toUpperCase();
        if (customerEl) customerEl.value = found.customerName;
        if (plateEl) plateEl.value = found.plate;
        newCaseState.policyVerified = true;
        const errBox = createDlg?.querySelector('[data-ux-create-error]');
        if (errBox) errBox.textContent = '';
        return true;
      }
      if (customerEl) customerEl.value = '';
      if (plateEl) plateEl.value = '';
      newCaseState.policyVerified = false;
      return false;
    };

    const verifyCreateCasePolicy = ({ silent = false, immediate = false } = {}) => {
      if (immediate || silent) {
        if (policyVerifyTimer) {
          window.clearTimeout(policyVerifyTimer);
          policyVerifyTimer = 0;
        }
        const ok = resolvePolicyLookup();
        if (ok) setPolicyButtonState('verified', { immediate });
        else if (!silent) setPolicyButtonState('error', { immediate });
        return ok;
      }
      if (policyVerifyState === 'pending') return false;
      if (policyVerifyTimer) {
        window.clearTimeout(policyVerifyTimer);
        policyVerifyTimer = 0;
      }
      setPolicyButtonState('pending');
      policyVerifyTimer = window.setTimeout(() => {
        policyVerifyTimer = 0;
        if (!isDialogOpen(createDlg)) return;
        const ok = resolvePolicyLookup();
        setPolicyButtonState(ok ? 'verified' : 'error');
      }, 220);
      return false;
    };

    const ccPicker = createDlg?.querySelector('#ux-cc-datetime-picker');
    const ccTimeHiddenEl = createDlg?.querySelector('#ux-cc-time');
    const ccTimeTriggerEl = createDlg?.querySelector('#ux-cc-time-trigger');
    const ccDateLabelEl = ccPicker?.querySelector('[data-date-label]');
    const ccTimeLabelEl = createDlg?.querySelector('[data-ux-cc-time-label]');
    const ccDateHeadingEl = createDlg?.querySelector('[data-ux-cc-date-heading]');
    const ccHoursBoxEl = createDlg?.querySelector('[data-ux-cc-hours]');
    const ccMinutesBoxEl = createDlg?.querySelector('[data-ux-cc-minutes]');
    const ccPickerDialogEl = ccPicker?.querySelector('.ux-datetime-picker__dialog');
    const CC_MONTH_SHORTS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const formatCcDateLabel = (isoDate) => {
      const parts = String(isoDate || '').split('-').map(Number);
      if (parts.length !== 3 || parts.some(Number.isNaN)) return 'Nov 18, 2026';
      return `${CC_MONTH_SHORTS[parts[1] - 1] || 'Nov'} ${parts[2]}, ${parts[0]}`;
    };

    const syncCcCalendarSelection = (isoDate) => {
      if (!ccPicker) return;
      ccPicker.dataset.date = isoDate;
      ccPicker.querySelectorAll('.ds-date-picker__day[data-date]').forEach((dayBtn) => {
        const isSel = dayBtn.dataset.date === isoDate;
        dayBtn.classList.toggle('ds-date-picker__day--start', isSel);
        dayBtn.classList.toggle('ds-date-picker__day--end', isSel);
      });
    };

    const syncCreateDateTimeUI = () => {
      const timeStr = `${newCaseState.accidentHour}:${newCaseState.accidentMinute}`;
      const dateStr = formatCcDateLabel(newCaseState.accidentDate);
      if (ccTimeHiddenEl) ccTimeHiddenEl.value = `${newCaseState.accidentDate} ${timeStr}`;
      if (ccDateLabelEl) ccDateLabelEl.textContent = dateStr;
      if (ccTimeLabelEl) ccTimeLabelEl.textContent = timeStr;
      if (ccDateHeadingEl) ccDateHeadingEl.textContent = dateStr;
    };

    const syncDraftDateTimeUI = () => {
      const timeStr = `${newCaseState.draftAccidentHour}:${newCaseState.draftAccidentMinute}`;
      const dateStr = formatCcDateLabel(newCaseState.draftAccidentDate);
      if (ccDateLabelEl) ccDateLabelEl.textContent = dateStr;
      if (ccTimeLabelEl) ccTimeLabelEl.textContent = timeStr;
      if (ccDateHeadingEl) ccDateHeadingEl.textContent = dateStr;
      syncCcCalendarSelection(newCaseState.draftAccidentDate);
      ccHoursBoxEl?.querySelectorAll('[data-ux-cc-hour]').forEach((btn) => {
        btn.setAttribute('aria-selected', String(btn.dataset.uxCcHour === newCaseState.draftAccidentHour));
      });
      ccMinutesBoxEl?.querySelectorAll('[data-ux-cc-minute]').forEach((btn) => {
        btn.setAttribute('aria-selected', String(btn.dataset.uxCcMinute === newCaseState.draftAccidentMinute));
      });
    };

    const closeCcDateTimePicker = () => {
      if (!ccPicker) return;
      ccPicker.dataset.dsOpen = 'false';
      ccTimeTriggerEl?.setAttribute('aria-expanded', 'false');
      if (ccPickerDialogEl) ccPickerDialogEl.hidden = true;
    };

    const cancelCcDateTimePicker = ({ returnFocus = false } = {}) => {
      newCaseState.draftAccidentDate = newCaseState.accidentDate;
      newCaseState.draftAccidentHour = newCaseState.accidentHour;
      newCaseState.draftAccidentMinute = newCaseState.accidentMinute;
      syncCcCalendarSelection(newCaseState.accidentDate);
      syncCreateDateTimeUI();
      closeCcDateTimePicker();
      if (returnFocus) ccTimeTriggerEl?.focus({ preventScroll: true });
    };

    const commitCcDateTimePicker = ({ returnFocus = false } = {}) => {
      newCaseState.accidentDate = newCaseState.draftAccidentDate;
      newCaseState.accidentHour = newCaseState.draftAccidentHour;
      newCaseState.accidentMinute = newCaseState.draftAccidentMinute;
      syncCcCalendarSelection(newCaseState.accidentDate);
      syncCreateDateTimeUI();
      closeCcDateTimePicker();
      if (returnFocus) ccTimeTriggerEl?.focus({ preventScroll: true });
    };

    const positionCcDateTimePicker = () => {
      if (!ccPicker || !ccTimeTriggerEl || !ccPickerDialogEl || ccPickerDialogEl.hidden) return;
      const trRect = ccTimeTriggerEl.getBoundingClientRect();
      const dlgRect = ccPickerDialogEl.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 12;
      const width = dlgRect.width || 416;
      const height = dlgRect.height || 360;
      let left = trRect.left;
      if (left + width > vw - margin) left = Math.max(margin, vw - width - margin);
      if (left < margin) left = margin;
      let top = trRect.bottom + 6;
      if (top + height > vh - margin && trRect.top - height - 6 >= margin) {
        top = trRect.top - height - 6;
      }
      ccPickerDialogEl.style.left = `${Math.round(left)}px`;
      ccPickerDialogEl.style.top = `${Math.round(top)}px`;
    };

    if (ccHoursBoxEl && !ccHoursBoxEl.children.length) {
      ccHoursBoxEl.innerHTML = Array.from({ length: 24 }, (_, h) => {
        const val = String(h).padStart(2, '0');
        return `<button type="button" role="option" class="ds-button ds-button--ghost ux-datetime-picker__time-opt ux-num" data-ux-cc-hour="${val}" aria-selected="${val === newCaseState.accidentHour}">${val}</button>`;
      }).join('');
      ccHoursBoxEl.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-ux-cc-hour]');
        if (!btn) return;
        e.stopPropagation();
        newCaseState.draftAccidentHour = btn.dataset.uxCcHour;
        syncDraftDateTimeUI();
      });
    }

    if (ccMinutesBoxEl && !ccMinutesBoxEl.children.length) {
      ccMinutesBoxEl.innerHTML = Array.from({ length: 12 }, (_, idx) => {
        const val = String(idx * 5).padStart(2, '0');
        return `<button type="button" role="option" class="ds-button ds-button--ghost ux-datetime-picker__time-opt ux-num" data-ux-cc-minute="${val}" aria-selected="${val === newCaseState.accidentMinute}">${val}</button>`;
      }).join('');
      ccMinutesBoxEl.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-ux-cc-minute]');
        if (!btn) return;
        e.stopPropagation();
        newCaseState.draftAccidentMinute = btn.dataset.uxCcMinute;
        syncDraftDateTimeUI();
      });
    }

    ccPicker?.addEventListener('ds-change', (e) => {
      if (e.detail?.date) {
        newCaseState.draftAccidentDate = e.detail.date;
        syncDraftDateTimeUI();
      }
    });

    ccPicker?.querySelectorAll('.ds-date-picker__nav-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        window.requestAnimationFrame(positionCcDateTimePicker);
      });
    });

    const scrollCcTimeColumnsToSelection = () => {
      const activeHour = ccHoursBoxEl?.querySelector('[aria-selected="true"]');
      if (activeHour && ccHoursBoxEl) {
        ccHoursBoxEl.scrollTop = Math.max(0, activeHour.offsetTop - ccHoursBoxEl.clientHeight / 2 + activeHour.clientHeight / 2);
      }
      const activeMinute = ccMinutesBoxEl?.querySelector('[aria-selected="true"]');
      if (activeMinute && ccMinutesBoxEl) {
        ccMinutesBoxEl.scrollTop = Math.max(0, activeMinute.offsetTop - ccMinutesBoxEl.clientHeight / 2 + activeMinute.clientHeight / 2);
      }
    };

    ccTimeTriggerEl?.addEventListener('click', () => {
      window.requestAnimationFrame(() => {
        if (ccPicker?.dataset.dsOpen === 'true') {
          newCaseState.draftAccidentDate = newCaseState.accidentDate;
          newCaseState.draftAccidentHour = newCaseState.accidentHour;
          newCaseState.draftAccidentMinute = newCaseState.accidentMinute;
          syncDraftDateTimeUI();
          positionCcDateTimePicker();
          scrollCcTimeColumnsToSelection();
        } else {
          cancelCcDateTimePicker({ returnFocus: false });
        }
      });
    });

    createDlg?.querySelector('[data-ux-cc-datetime-cancel]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      cancelCcDateTimePicker({ returnFocus: true });
    });

    createDlg?.querySelector('[data-ux-cc-datetime-done]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      commitCcDateTimePicker({ returnFocus: true });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && ccPicker?.dataset.dsOpen === 'true') {
        e.preventDefault();
        e.stopPropagation();
        cancelCcDateTimePicker({ returnFocus: true });
      }
    }, true);

    document.addEventListener('click', (e) => {
      if (ccPicker?.dataset.dsOpen === 'true' && !ccPicker.contains(e.target)) {
        cancelCcDateTimePicker({ returnFocus: false });
      }
    });

    createDlg?.querySelector('.ux-dialog__body')?.addEventListener('scroll', positionCcDateTimePicker, { passive: true });
    window.addEventListener('resize', positionCcDateTimePicker, { passive: true });

    const renderCreateSlots = () => {
      const container = createDlg?.querySelector('[data-ux-create-slots]');
      if (!container) return;
      container.innerHTML = newCaseState.slots.map((s) => {
        const badgeClass = !s.file ? 'ds-badge--default' : (s.valid ? 'ds-badge--green' : 'ds-badge--red');
        const badgeText = !s.file ? 'Empty' : (s.valid ? 'Ready' : 'Invalid');
        return `
          <div class="ux-video-slot" data-ux-slot="${s.slot}" data-has-file="${Boolean(s.file)}" data-invalid="${!s.valid}">
            <div class="ux-video-slot__head">
              <span class="ux-label ux-video-slot__title">${esc(s.label)}</span>
              <span class="ds-badge ds-badge--pill ${badgeClass}">${badgeText}</span>
            </div>
            ${renderVideoSlotMetaHtml({
              hasFile: Boolean(s.file),
              error: s.error,
              name: s.file?.name || '',
              durationSec: s.file?.durationSec || 0,
              sizeMb: s.file?.sizeMb || 0,
            })}
            <div class="ux-video-slot__actions">
              <button type="button" class="ds-button ds-button--secondary ds-button--sm" data-ux-slot-valid="${s.slot}">${s.file ? 'Replace' : 'Upload'}</button>
              ${s.file ? `<button type="button" class="ds-button ds-button--danger ds-button--sm" data-ux-slot-clear="${s.slot}">Remove</button>` : ''}
            </div>
          </div>
        `;
      }).join('');

      const applySlotFile = (slotNo, fileObj) => {
        const target = newCaseState.slots.find((x) => x.slot === slotNo);
        if (!target) return;
        target.file = fileObj;
        if (!fileObj) { target.valid = true; target.error = ''; }
        else {
          const extOk = /\.(mp4|mov|avi|mkv)$/i.test(fileObj.name);
          if (!extOk) { target.valid = false; target.error = 'Unsupported format (.mp4/.mov/.avi/.mkv).'; }
          else if (fileObj.durationSec > 180) { target.valid = false; target.error = `Duration ${fileObj.durationSec}s exceeds 180s limit.`; }
          else if (fileObj.sizeMb > 200) { target.valid = false; target.error = `Size ${fileObj.sizeMb}MB exceeds 200MB limit.`; }
          else { target.valid = true; target.error = ''; }
        }
        const errBox = createDlg?.querySelector('[data-ux-create-error]');
        if (errBox) errBox.textContent = '';
        renderCreateSlots();
        triggerCreateSummaryAnalysis(slotNo);
      };

      const attachDemoSlotFile = (slotNo) =>
        applySlotFile(slotNo, { name: `cam0${slotNo}_accident.mp4`, durationSec: 24, sizeMb: 38 });

      container.querySelectorAll('[data-ux-slot-valid]').forEach((b) => b.addEventListener('click', () =>
        attachDemoSlotFile(Number(b.dataset.uxSlotValid))));
      container.querySelectorAll('.ux-video-slot[data-ux-slot]').forEach((slotEl) => {
        const slotNo = Number(slotEl.dataset.uxSlot);
        slotEl.addEventListener('dragenter', (e) => {
          e.preventDefault();
          slotEl.dataset.dragover = 'true';
        });
        slotEl.addEventListener('dragover', (e) => {
          e.preventDefault();
          slotEl.dataset.dragover = 'true';
        });
        slotEl.addEventListener('dragleave', (e) => {
          if (!slotEl.contains(e.relatedTarget)) delete slotEl.dataset.dragover;
        });
        slotEl.addEventListener('drop', (e) => {
          e.preventDefault();
          delete slotEl.dataset.dragover;
          const dropped = e.dataTransfer?.files?.[0];
          if (dropped) {
            applySlotFile(slotNo, {
              name: dropped.name,
              durationSec: 24,
              sizeMb: Math.max(1, Math.round(dropped.size / (1024 * 1024))),
            });
          } else {
            attachDemoSlotFile(slotNo);
          }
        });
      });
      container.querySelectorAll('[data-ux-slot-clear]').forEach((b) => b.addEventListener('click', () =>
        applySlotFile(Number(b.dataset.uxSlotClear), null)));
    };

    createDlg?.addEventListener('ux-dialog-closed', () => {
      closeCcDateTimePicker();
      resetNewCaseSlots();
      resetPolicyVerify({ immediate: true });
      const errBox = createDlg.querySelector('[data-ux-create-error]');
      if (errBox) errBox.textContent = '';
    });

    document.querySelector('[data-action="create-case"]')?.addEventListener('click', () => {
      if (!createDlg) return;
      closeCcDateTimePicker();
      resetNewCaseSlots();
      const nextNum = 149 + store.cases.length - 8;
      const idEl = createDlg.querySelector('#ux-cc-id');
      const policyEl = createDlg.querySelector('#ux-cc-policy');
      const customerEl = createDlg.querySelector('#ux-cc-customer');
      const plateEl = createDlg.querySelector('#ux-cc-plate');
      if (idEl) idEl.value = `CASE-2026-0${nextNum}`;
      if (policyEl) policyEl.value = '';
      if (customerEl) customerEl.value = '';
      if (plateEl) plateEl.value = '';
      newCaseState.policyVerified = false;
      resetPolicyVerify({ immediate: true });
      newCaseState.accidentDate = '2026-11-18';
      newCaseState.accidentHour = '09';
      newCaseState.accidentMinute = '30';
      newCaseState.draftAccidentDate = '2026-11-18';
      newCaseState.draftAccidentHour = '09';
      newCaseState.draftAccidentMinute = '30';
      syncCcCalendarSelection(newCaseState.accidentDate);
      syncCreateDateTimeUI();
      syncDraftDateTimeUI();
      autoSizeSummaryTextarea();
      const errBox = createDlg.querySelector('[data-ux-create-error]');
      if (errBox) errBox.textContent = '';
      renderCreateSlots();
      openDialogSmooth(createDlg);
    });

    createDlg?.querySelector('#ux-cc-policy')?.addEventListener('input', () => {
      newCaseState.policyVerified = false;
      resetPolicyVerify({ immediate: false });
      const customerEl = createDlg.querySelector('#ux-cc-customer');
      const plateEl = createDlg.querySelector('#ux-cc-plate');
      if (customerEl) customerEl.value = '';
      if (plateEl) plateEl.value = '';
    });

    createDlg?.querySelector('#ux-cc-policy')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        verifyCreateCasePolicy();
      }
    });

    createDlg?.querySelector('[data-ux-lookup-policy]')?.addEventListener('click', () => {
      verifyCreateCasePolicy();
    });

    createDlg?.querySelector('[data-ux-create-form]')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const errBox = createDlg.querySelector('[data-ux-create-error]');
      if (!newCaseState.policyVerified && !verifyCreateCasePolicy({ silent: true, immediate: true })) {
        setPolicyButtonState('error');
        if (errBox) errBox.textContent = 'Verify a valid policy number (e.g. POL-2026-8801).';
        createDlg.querySelector('#ux-cc-policy')?.focus();
        return;
      }
      const validFiles = newCaseState.slots.filter((s) => s.file && s.valid);
      const invalidFiles = newCaseState.slots.filter((s) => s.file && !s.valid);
      if (invalidFiles.length > 0) { if (errBox) errBox.textContent = 'Fix or remove invalid clips.'; return; }
      if (validFiles.length === 0) { if (errBox) errBox.textContent = 'Attach at least 1 valid clip (.mp4/.mov/.avi/.mkv).'; return; }
      if (errBox) errBox.textContent = '';

      const id = createDlg.querySelector('#ux-cc-id').value.trim();
      const policyNo = createDlg.querySelector('#ux-cc-policy').value.trim();
      const customerName = createDlg.querySelector('#ux-cc-customer').value.trim();
      const plate = createDlg.querySelector('#ux-cc-plate').value.trim();
      const accidentTime = createDlg.querySelector('#ux-cc-time').value.trim() || `${newCaseState.accidentDate} ${newCaseState.accidentHour}:${newCaseState.accidentMinute}`;
      const location = createDlg.querySelector('#ux-cc-location').value.trim() || 'Seoul Arterial Junction';
      const rawSummary = createDlg.querySelector('#ux-cc-summary').value.trim();
      const summary = rawSummary || buildAiSummaryFromSlots(validFiles) || 'Intersection T-bone';

      store.cases.unshift({
        id,
        plate,
        policyNo,
        customerName,
        accidentTime,
        location,
        summary,
        scenario: 'Intersection T-bone',
        baseRatio: '20 : 80',
        baseInsuredPct: 20,
        baseOpponentPct: 80,
        stage: 'analyzing',
        analysisDone: false,
        isClosed: false,
        archived: false,
        selectedChart: 'KNIA-205',
        interpretation: '',
        rerunGuidance: summary ? { 1: summary } : {},
        step1Contexts: summary ? [{ id: 'case-summary', kind: 'text', label: 'Case summary', text: summary }] : [],
        versions: [],
        factors: [
          { id: `f-${Date.now()}`, side: 'counterparty', group: 'Scenario', title: 'Insured entered under green phase', rationale: 'Initial AI flag.', delta: 10, status: 'negotiating', note: '' },
        ],
        videos: newCaseState.slots.map((s) => ({
          slot: s.slot, label: s.label, name: s.file?.name || 'Empty slot', durationSec: s.file?.durationSec || 24, sizeMb: s.file?.sizeMb || 0, present: Boolean(s.file),
        })),
        events: [
          { id: 'ev1', shortTag: 'Entry', kind: 'entry', hud: 'Approach · 42 km/h', name: 'Corridor entry', time: '00:09.8', conf: 95, source: 'CV Track', frame: 'Frame 588', cam: 1 },
          { id: 'ev2', shortTag: 'Signal', kind: 'signal', hud: 'Green · Verified', name: 'Signal check', time: '00:11.6', conf: 92, source: 'Telemetry', frame: 'Frame 696', cam: 4 },
          { id: 'ev3', shortTag: 'Impact', kind: 'impact', hud: 'Impact · 2.8G peak', name: 'Primary impact', time: '00:12.4', conf: 97, source: 'IMU + CV', frame: 'Frame 744', cam: 1 },
          { id: 'ev4', shortTag: 'Stop', kind: 'rest', hud: 'Rest · 0 km/h', name: 'Final resting stop', time: '00:14.8', conf: 94, source: 'IMU', frame: 'Frame 888', cam: 2 },
        ],
        pdfSections: [
          { id: 'sec1', title: '1. Case & policy metadata', enabled: true, body: `${id} | Policy ${policyNo} | Plate ${plate}` },
          { id: 'sec2', title: '2. Video keyframes', enabled: true, body: `Synced ${validFiles.length} clip(s). Impact at 00:12.4.` },
          { id: 'sec3', title: '3. KNIA chart rationale', enabled: true, body: 'KNIA-205 pending confirmation.' },
        ],
        noticeChannel: 'kakao',
        noticeMessage: `Hello ${customerName},\nVideo clips for ${id} (${plate}) were received for KNIA analysis.`,
        publicNoticeLink: '',
        noticePrecedentState: {},
        selectedEvidenceMap: {},
        evidenceAnalysedChart: null,
        step3AnalysedKey: null,
      });
      logActivity(id, 'OTHER', `Created new case (${validFiles.length} clips attached)`, 'Adjuster');
      closeCcDateTimePicker();
      resetNewCaseSlots();
      closeDialogSmooth(createDlg);
      renderCaseQueueRows();
      openCaseWorkbench(id, false);
    });

    const closedDlg = dialogs.closedEntry;
    closedDlg?.querySelector('[data-ux-closed-view]')?.addEventListener('click', () => {
      const id = closedDlg.dataset.pendingCaseId;
      closeDialogSmooth(closedDlg);
      if (id) openCaseWorkbench(id, false);
    });
    closedDlg?.querySelector('[data-ux-closed-reopen]')?.addEventListener('click', () => {
      const id = closedDlg.dataset.pendingCaseId;
      const c = id ? getCase(id) : null;
      if (!c) {
        closeDialogSmooth(closedDlg);
        return;
      }
      c.isClosed = false;
      c.stage = c.versions.length ? 'negotiating' : 'pending_chart';
      logActivity(c.id, 'OTHER', 'Reopened closed case from Queue prompt', 'Adjuster');
      syncCaseClosedControls(c);
      closeDialogSmooth(closedDlg);
      renderCaseQueueRows();
      openCaseWorkbench(c.id, false);
    });

    document.querySelector('[data-action="manage-videos"]')?.addEventListener('click', () => {
      const dlg = dialogs.manageVideos;
      if (!dlg) return;
      const c = getCase();
      if (!c || c.isClosed) return;
      const body = dlg.querySelector('[data-ux-manage-videos-body]');
      const renderManageVideosBody = () => {
        if (!body) return;
        const presentCount = c.videos.filter((x) => x.present).length;
        body.innerHTML = `
          <div class="ux-slot-grid">
            ${c.videos.map((v) => `
              <div class="ux-video-slot" data-has-file="${v.present}">
                <div class="ux-video-slot__head">
                  <span class="ux-label ux-video-slot__title ux-num">CAM 0${v.slot} · ${esc(v.label)}</span>
                  <span class="ds-badge ds-badge--pill ${v.present ? 'ds-badge--green' : 'ds-badge--default'}">${v.present ? 'Active' : 'Empty'}</span>
                </div>
                ${renderVideoSlotMetaHtml({
                  hasFile: v.present,
                  error: '',
                  name: v.name,
                  durationSec: v.durationSec,
                  sizeMb: v.sizeMb,
                })}
                <div class="ux-video-slot__actions">
                  <button type="button" class="ds-button ds-button--secondary ds-button--sm" data-ux-mv-toggle="${v.slot}" ${c.isClosed ? 'disabled' : ''}>${v.present ? 'Replace' : 'Attach MP4'}</button>
                  ${v.present && presentCount > 1 ? `<button type="button" class="ds-button ds-button--danger ds-button--sm" data-ux-mv-remove="${v.slot}" ${c.isClosed ? 'disabled' : ''}>Remove</button>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        `;
        body.querySelectorAll('[data-ux-mv-toggle]').forEach((b) => {
          b.addEventListener('click', () => {
            const v = c.videos.find((x) => x.slot === Number(b.dataset.uxMvToggle));
            if (!v || c.isClosed) return;
            v.present = true;
            v.name = `cam0${v.slot}_synced.mp4`;
            v.durationSec = 24;
            v.sizeMb = 36;
            logActivity(c.id, 'OTHER', `Updated video slot CAM 0${v.slot}`, 'Adjuster');
            renderManageVideosBody();
            renderVideoTimeline(c);
          });
        });
        body.querySelectorAll('[data-ux-mv-remove]').forEach((b) => {
          b.addEventListener('click', () => {
            const v = c.videos.find((x) => x.slot === Number(b.dataset.uxMvRemove));
            if (!v || c.isClosed || c.videos.filter((x) => x.present).length <= 1) return;
            v.present = false;
            v.name = 'Empty slot';
            v.sizeMb = 0;
            if (videoCanvasEl?.dataset.activeCam === String(v.slot)) {
              const fallbackCam = c.videos.find((x) => x.present);
              if (fallbackCam) bridge.setActiveCamera(String(fallbackCam.slot));
            }
            logActivity(c.id, 'OTHER', `Removed video slot CAM 0${v.slot}`, 'Adjuster');
            renderManageVideosBody();
            renderVideoTimeline(c);
          });
        });
      };
      renderManageVideosBody();
      openDialogSmooth(dlg);
    });

    dialogs.versionWarning?.querySelector('[data-ux-confirm-v2]')?.addEventListener('click', () => {
      const id = dialogs.versionWarning.dataset.pendingCaseId;
      closeDialogSmooth(dialogs.versionWarning);
      commitNewReportVersion(getCase(id), true);
    });

    dialogs.closeCase?.querySelector('[data-ux-close-form]')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const c = getCase();
      if (!c) return;
      const reason = 'Closed';
      const memo = 'Closed during review.';
      c.isClosed = true;
      c.stage = 'closed';
      c.closeReason = reason;
      c.closeMemo = memo;
      c.closedAt = nowStamp();
      logActivity(c.id, 'OTHER', 'Closed case · Read-only activated', 'Adjuster');
      syncCaseClosedControls(c);
      closeDialogSmooth(dialogs.closeCase);
      renderCaseQueueRows();
      renderBanners(c);
      selectStep(4);
    });

    document.querySelector('[data-action="detail-history"]')?.addEventListener('click', () => {
      const dlg = dialogs.caseHistory;
      if (!dlg) return;
      const c = getCase();
      const logs = store.activityLog.filter((l) => l.caseId === c.id);
      dlg.querySelector('[data-ux-case-history-title]').textContent = `Activity log · ${c.id}`;
      dlg.querySelector('[data-ux-case-history-body]').innerHTML = `
        <div class="ds-table-wrap" tabindex="0">
          <table class="ds-table">
            <thead><tr><th>Time</th><th>Category</th><th>Actor</th><th>Detail</th></tr></thead>
            <tbody>
              ${logs.length ? logs.map((l) => `
                <tr>
                  <td class="ux-mono">${esc(l.time)}</td>
                  <td><span class="ds-badge ds-badge--pill ${getActivityCategoryBadge(l.type)}">${esc(l.type)}</span></td>
                  <td>${esc(l.actor)}</td>
                  <td>${esc(l.action)}</td>
                </tr>
              `).join('') : '<tr><td colspan="4">No logs recorded.</td></tr>'}
            </tbody>
          </table>
        </div>
      `;
      openDialogSmooth(dlg);
    });
  };

  const openChartCompareModal = (c) => {
    const dlg = dialogs.chartCompare;
    if (!dlg) return;
    const candidates = getChartsForCase(c).slice(0, 3);
    const body = dlg.querySelector('[data-ux-compare-body]');
    if (body) {
      body.innerHTML = `
        <div class="ds-table-wrap" tabindex="0">
          <table class="ds-table">
            <thead>
              <tr><th>Moment</th>${candidates.map((ch) => `<th>${esc(scenarioLabel(ch))} (${esc(ch.baseRatio)})</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${c.events.map((ev, rIdx) => `
                <tr>
                  <td><span class="ux-num">${esc(ev.time)}</span> · ${esc(ev.shortTag)}</td>
                  ${candidates.map((ch, cIdx) => {
                    const verdict = cIdx === 0 ? 'Supports' : (rIdx % 2 === 0 ? 'Unclear' : 'Conflicts');
                    const badge = verdict === 'Supports' ? 'ds-badge--green' : verdict === 'Unclear' ? 'ds-badge--yellow' : 'ds-badge--red';
                    return `<td><span class="ds-badge ds-badge--pill ${badge}">${verdict}</span></td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
    openDialogSmooth(dlg);
  };

  const syncSegmentedThumb = (segRoot) => {
    if (!segRoot) return;
    const activeBtn = segRoot.querySelector('[data-state="on"], [aria-selected="true"], [aria-checked="true"]') || segRoot.querySelector('button');
    if (activeBtn && activeBtn.offsetWidth > 0) {
      segRoot.style.setProperty('--thumb-left', `${activeBtn.offsetLeft}px`);
      segRoot.style.setProperty('--thumb-width', `${activeBtn.offsetWidth}px`);
    }
  };

  const getChartTypeGroup = (ch) => {
    const cat = String(ch?.category || '').toLowerCase();
    if (cat.includes('signal')) return 'signal';
    if (cat.includes('turn')) return 'turn';
    if (cat.includes('lane')) return 'lane';
    if (cat.includes('rear')) return 'rear';
    return 'other';
  };

  const openKniaLibraryModal = (c) => {
    const dlg = dialogs.kniaLibrary;
    if (!dlg) return;

    const typeSeg = dlg.querySelector('[data-ux-lib-type-filter]');
    const search = dlg.querySelector('#ux-lib-search');
    let activeLibType = 'all';

    const applyManualChartSelection = (code) => {
      if (c.isClosed || !code) return;
      if (!Array.isArray(c.manualCharts)) c.manualCharts = [];
      const baseMatches = c.lowMatchSimulation
        ? []
        : KNIA_CHART_CATALOG.filter((x) => !x.isManual && (x.fitByScenario?.[c.scenario] ?? 0) >= 20)
            .sort((a, b) => (b.fitByScenario?.[c.scenario] ?? 0) - (a.fitByScenario?.[c.scenario] ?? 0))
            .slice(0, 5);
      if (!baseMatches.some((x) => x.code === code)) {
        c.manualCharts = [code, ...c.manualCharts.filter((x) => x !== code)];
      }
      c.analysisDone = true;
      if (c.stage === 'undetermined') c.stage = 'pending_report';
      if (step1WrapEl) step1WrapEl.hidden = false;
      logActivity(c.id, 'ANALYSIS', `Added ${scenarioLabel(code)}`, 'Adjuster');
      handleSelectChart(c, code, { forceExpand: true });
      renderStep1(c, false);
      closeDialogSmooth(dlg);
      renderBanners(c);
    };

    const renderLib = (q = '') => {
      const ql = q.trim().toLowerCase();
      const filtered = KNIA_CHART_CATALOG.filter((ch) => (
        (activeLibType === 'all' || getChartTypeGroup(ch) === activeLibType)
        && (!ql || `${ch.code} ${scenarioLabel(ch)} ${ch.category} ${ch.title}`.toLowerCase().includes(ql))
      ));
      const wrap = dlg.querySelector('[data-ux-library-list]');
      if (!wrap) return;
      wrap.innerHTML = filtered.length === 0 ? '<p class="ux-lib-empty">No matching scenarios</p>' : `
        <div class="ux-lib-list">
          ${filtered.map((ch) => {
            const isSelected = c.selectedChart === ch.code;
            return `
              <div class="ux-lib-item" data-selected="${isSelected}">
                <div class="ux-lib-thumb" aria-hidden="true">${buildScenarioSimulationSvg(ch, { animated: false })}</div>
                <div class="ux-lib-item__meta">
                  <span class="ux-lib-item__title">${esc(ch.title)}</span>
                  <span class="ux-lib-item__sub ux-num">${esc(scenarioLabel(ch))} · ${esc(ch.category)}</span>
                </div>
                <div class="ux-lib-item__end">
                  <span class="ux-metric-pair__val">${esc(ch.baseRatio)}</span>
                  <button type="button" class="ds-button ${isSelected ? 'ds-button--ghost' : 'ds-button--secondary'}" data-ux-lib-pick="${esc(ch.code)}" ${c.isClosed ? 'disabled' : ''}>${isSelected ? 'Selected' : 'Use scenario'}</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
      wrap.querySelectorAll('[data-ux-lib-pick]').forEach((b) => {
        b.addEventListener('click', () => applyManualChartSelection(b.dataset.uxLibPick));
      });
    };

    const resetTypeTabs = (nextType = 'all') => {
      activeLibType = nextType;
      typeSeg?.querySelectorAll('button[data-value]').forEach((btn) => {
        const active = btn.dataset.value === activeLibType;
        btn.setAttribute('aria-selected', String(active));
        btn.setAttribute('aria-checked', String(active));
        btn.setAttribute('aria-pressed', String(active));
        btn.dataset.state = active ? 'on' : 'off';
      });
    };

    if (typeSeg) {
      typeSeg._onTypeChange = (nextVal) => {
        activeLibType = nextVal || 'all';
        renderLib(search?.value || '');
      };
      if (!typeSeg.dataset.uxLibBound) {
        typeSeg.dataset.uxLibBound = 'true';
        typeSeg.addEventListener('ds-change', (e) => {
          if (e.detail?.value) typeSeg._onTypeChange?.(e.detail.value);
        });
      }
    }

    if (search) {
      search.value = '';
      search.oninput = () => renderLib(search.value);
    }

    resetTypeTabs('all');
    renderLib('');
    openDialogSmooth(dlg);
    requestAnimationFrame(() => {
      syncSegmentedThumb(typeSeg);
      search?.focus({ preventScroll: true });
    });
  };

  const openAddModifierModal = (c) => {
    const dlg = dialogs.addModifier;
    if (!dlg || !c || c.isClosed) return;
    const form = dlg.querySelector('[data-ux-add-modifier-form]');
    const sideInput = dlg.querySelector('#ux-nf-side');
    const deltaInput = dlg.querySelector('#ux-nf-delta');
    const titleInput = dlg.querySelector('#ux-nf-title');
    const detailsInput = dlg.querySelector('#ux-nf-details');

    const syncDropdownReset = (ddAttr, hiddenEl, val, label) => {
      const dd = dlg.querySelector(`[${ddAttr}]`);
      const valEl = dd?.querySelector('[data-ds-dropdown-value]');
      if (hiddenEl) hiddenEl.value = val;
      if (valEl) valEl.textContent = label;
      dd?.querySelectorAll('[role="option"]').forEach((opt) => {
        const matched = opt.dataset.value === val;
        opt.setAttribute('aria-selected', String(matched));
        if (matched) opt.setAttribute('data-checked', 'true');
        else opt.removeAttribute('data-checked');
        const chk = opt.querySelector('.ds-dropdown__check');
        if (chk) {
          chk.classList.toggle('ds-dropdown__check--empty', !matched);
          chk.innerHTML = matched ? ICON_CHECK : '';
        }
      });
    };

    syncDropdownReset('data-ux-nf-side-dd', sideInput, 'counterparty', 'Counterparty');
    if (deltaInput) deltaInput.value = '10';
    if (titleInput) titleInput.value = '';
    if (detailsInput) detailsInput.value = '';

    if (!dlg.dataset.modDdBound) {
      dlg.dataset.modDdBound = 'true';
      dlg.querySelector('[data-ux-nf-side-dd]')?.addEventListener('ds-change', (e) => {
        const nextVal = e.detail?.value;
        if (sideInput && nextVal) sideInput.value = nextVal;
      });
    }

    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        if (c.isClosed) return;
        const side = sideInput?.value === 'insured' ? 'insured' : 'counterparty';
        const rawWeight = Math.abs(parseInt(deltaInput?.value || '10', 10) || 10);
        const title = (titleInput?.value || '').trim();
        if (!title) return;
        const details = (detailsInput?.value || '').trim() || 'Added manually during negotiation.';
        c.factors.push({
          id: `f-${Date.now()}`,
          side,
          group: 'Modifier',
          title,
          rationale: details,
          delta: rawWeight,
          status: 'negotiating',
          note: details,
        });
        logActivity(c.id, 'NEGO', `Added ${modifierPartyLabel({ side })} modifier: ${title} (${side === 'counterparty' ? '-' : '+'}${rawWeight}%)`, 'Adjuster');
        closeDialogSmooth(dlg);
        const primaryScrollEl = document.querySelector('.ds-detail-workspace--primary');
        const prevTop = primaryScrollEl ? primaryScrollEl.scrollTop : 0;
        runWithViewTransition(() => {
          renderStep3Body(c, false);
          renderFloatBar(c);
          if (primaryScrollEl) primaryScrollEl.scrollTop = prevTop;
        });
      };
    }

    openDialogSmooth(dlg);
    requestAnimationFrame(() => {
      titleInput?.focus({ preventScroll: true });
    });
  };

  const openPdfPreviewModal = (c, heading) => {
    const dlg = dialogs.pdfPreview;
    if (!dlg) return;
    dlg.querySelector('[data-ux-pdf-title]').textContent = `${heading} · ${c.id}`;
    dlg.querySelector('[data-ux-pdf-body]').innerHTML = `
      <div class="ux-empty-card">
        <div class="ds-platform-empty">
          <div class="ds-platform-empty__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M3.5 2L3.5 1.25C3.08579 1.25 2.75 1.58579 2.75 2L3.5 2ZM20.5 2H21.25C21.25 1.58579 20.9142 1.25 20.5 1.25V2ZM3.5 22H2.75C2.75 22.1989 2.82902 22.3897 2.96967 22.5303C3.11032 22.671 3.30109 22.75 3.5 22.75V22ZM13.5 22V22.75H13.8107L14.0303 22.5303L13.5 22ZM20.5 15L21.0303 15.5303L21.25 15.3107V15H20.5ZM13.5 15V14.25H12.75V15H13.5ZM3.5 2.75L20.5 2.75V1.25L3.5 1.25L3.5 2.75ZM4.25 22L4.25 2L2.75 2L2.75 22H4.25ZM3.5 22.75H13.5V21.25H3.5V22.75ZM21.25 15V2H19.75V15H21.25ZM14.0303 22.5303L21.0303 15.5303L19.9697 14.4697L12.9697 21.4697L14.0303 22.5303ZM14.25 22V15H12.75V22H14.25ZM13.5 15.75H20.5V14.25H13.5V15.75Z" fill="currentColor"/><path d="M8 7H16" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 11H12" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
          </div>
          <strong>No preview available yet</strong>
          <p>PDF preview will appear here once export templates are connected.</p>
        </div>
      </div>
    `;
    openDialogSmooth(dlg);
  };

  // ── Docked Ask AI Agent (SMT Case Agent Actions) ──
  const appendCustomAgentMsg = (userText, c = getCase()) => {
    const trimmed = (userText || '').trim();
    if (!trimmed || !bridge.agentMessages || !bridge.agentWelcome) return;
    bridge.agentWelcome.hidden = true;
    bridge.agentMessages.hidden = false;

    const u = document.createElement('div');
    u.className = 'ds-agent-msg ds-agent-msg--user';
    u.textContent = trimmed;
    bridge.agentMessages.appendChild(u);

    let replyText = `Case ${c.id} (${c.selectedChart ? scenarioLabel(c.selectedChart) : 'No scenario'} · ${c.baseRatio}): Verified all 4 synchronized feeds around impact 00:12.4.`;
    const lower = trimmed.toLowerCase();
    if (lower.includes('ai halt') || lower.includes('simulate halt')) {
      if (c.isClosed) {
        replyText = 'Closed case — reopen before editing.';
      } else {
        c.stage = 'undetermined';
        c.analysisDone = false;
        c.lowMatchSimulation = false;
        c.haltStage = 'Unclear lane marking';
        c.haltReason = 'Glare occluded lane divider near 00:12.4.';
        renderVideoTimeline(c);
        renderBanners(c);
        renderCaseQueueRows();
        selectStep(1);
        replyText = 'Paused at 00:12.4 (glare on lane divider). Confirm timestamp or add scenario manually.';
      }
    } else if (lower.includes('<20%') || lower.includes('low match') || lower.includes('restore match')) {
      if (c.isClosed) {
        replyText = 'Closed case — reopen before editing.';
      } else {
        c.lowMatchSimulation = !c.lowMatchSimulation;
        c.stage = c.lowMatchSimulation ? 'undetermined' : 'pending_chart';
        c.analysisDone = true;
        renderBanners(c);
        renderCaseQueueRows();
        selectStep(1);
        replyText = c.lowMatchSimulation
          ? 'Simulated <20% match. Use Add scenario in Step 1 to assign manually.'
          : 'Restored standard KNIA scenarios.';
      }
    } else if (lower.includes('scenario 203') || lower.includes('chart 203') || lower.includes('knia-203')) {
      if (c.isClosed) {
        replyText = 'Closed case — reopen before editing.';
      } else {
        handleSelectChart(c, 'KNIA-203', { forceExpand: true });
        selectStep(2);
        replyText = `Switched ${c.id} to Scenario 203 (90 : 10). Confirm baseline in Evidence to issue v${c.versions.length + 1}.`;
      }
    } else if (lower.includes('00:12.4') || lower.includes('paused') || lower.includes('undetermined') || lower.includes('resolve')) {
      if (c.isClosed) {
        replyText = 'Closed case — reopen before editing.';
      } else if (c.stage !== 'undetermined') {
        replyText = `Case ${c.id} is not paused in an undetermined stage.`;
      } else {
        c.stage = 'pending_chart';
        c.lowMatchSimulation = false;
        c.selectedChart = c.selectedChart || 'KNIA-205';
        c.analysisDone = true;
        renderCaseQueueRows();
        renderBanners(c);
        selectStep(1);
        replyText = 'Resolved analysis pause at 00:12.4. Matching accident scenarios are ready in Step 1.';
      }
    } else if (lower.includes('negotiation')) {
      selectStep(c.versions.length ? 3 : 2);
      replyText = `For ${c.id}, highlight the counterparty red-clearance entry and absence of braking at 00:11.6 (-10% insured).`;
    }

    const r = document.createElement('div');
    r.className = 'ds-agent-msg ds-agent-msg--assistant';
    r.textContent = replyText;
    bridge.agentMessages.appendChild(r);
    logActivity(c.id, 'CHAT', `SMT Case Agent: "${trimmed}"`, 'Adjuster');
    if (bridge.agentScroll) bridge.agentScroll.scrollTop = bridge.agentScroll.scrollHeight;
  };

  document.querySelectorAll('[data-agent-prompt]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      appendCustomAgentMsg(btn.dataset.agentPrompt || btn.textContent?.trim());
    });
  });
  const agentForm = document.querySelector('[data-agent-composer]');
  agentForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    const rawText = bridge.agentInput?.value.trim() || '';
    const attached = bridge.consumeAgentAttachments?.() || [];
    if (!rawText && !attached.length) return;
    const msgText = attached.length
      ? `${rawText}${rawText ? ' ' : ''}[Attached: ${attached.join(', ')}]`
      : rawText;
    appendCustomAgentMsg(msgText);
    if (bridge.agentInput) bridge.agentInput.value = '';
    bridge.syncAgentComposerState?.();
  }, true);
  bridge.agentInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.isComposing) {
      e.stopPropagation();
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      agentForm?.requestSubmit();
    }
  }, true);

  // ── Sidebar Global Views: History, Archived, Rule Management ──
  let historyFilterType = 'ALL';
  let historyActorFilter = 'all';
  let historyCaseFilter = 'all';
  let historySearchQ = '';
  const renderGlobalHistoryView = () => {
    const sec = viewSections.history;
    if (!sec) return;

    const actorOptions = [
      ['all', 'All actors'],
      ...Array.from(new Set(['Adjuster', 'AI VLM', 'System', ...store.activityLog.map((l) => l.actor).filter(Boolean)])).map((a) => [a, a]),
    ];
    const caseOptions = [
      ['all', 'All cases'],
      ...Array.from(new Set([...store.cases.map((c) => c.id), ...store.activityLog.map((l) => l.caseId).filter(Boolean)])).map((id) => [id, id]),
    ];

    const renderHistoryRows = () => {
      const tbodyEl = sec.querySelector('[data-ux-hist-tbody]');
      if (!tbodyEl) return;
      const filtered = store.activityLog.filter((l) =>
        (historyFilterType === 'ALL' || l.type === historyFilterType) &&
        (historyActorFilter === 'all' || l.actor === historyActorFilter) &&
        (historyCaseFilter === 'all' || l.caseId === historyCaseFilter) &&
        (!historySearchQ || `${l.caseId} ${l.action} ${l.actor} ${l.type}`.toLowerCase().includes(historySearchQ))
      );
      tbodyEl.innerHTML = filtered.length === 0
        ? `<tr class="ds-table__empty-row"><td colspan="5" class="ds-table__empty-cell">${store.activityLog.length === 0 ? 'No activity logs yet' : 'No matching activity logs'}</td></tr>`
        : filtered.map((l) => `
          <tr>
            <td class="ux-mono">${esc(l.time)}</td>
            <td><button type="button" class="ds-button ds-button--ghost ds-button--sm ux-mono ux-hist-case-link" data-ux-open-case="${esc(l.caseId)}">${esc(l.caseId)}</button></td>
            <td><span class="ds-badge ds-badge--pill ${getActivityCategoryBadge(l.type)}">${esc(l.type)}</span></td>
            <td>${esc(l.actor)}</td>
            <td>${esc(l.action)}</td>
          </tr>
        `).join('');
      tbodyEl.querySelectorAll('[data-ux-open-case]').forEach((b) => b.addEventListener('click', () => {
        openCaseWorkbench(b.dataset.uxOpenCase, true);
      }));
      const resetBtn = sec.querySelector('[data-ux-hist-shell] [data-ds-filter-reset]');
      if (resetBtn) {
        resetBtn.hidden = !(historySearchQ || historyActorFilter !== 'all' || historyCaseFilter !== 'all');
      }
    };

    if (!sec.querySelector('[data-ux-hist-shell]')) {
      sec.innerHTML = `
        <header class="ds-workspace-header"><h1 class="ds-workspace-header__title">Activity log</h1></header>
        <div class="ds-filter-bar ds-workspace-toolbar" role="toolbar" aria-label="Activity log controls" data-ux-hist-shell>
          <div class="ds-filter-bar__group">
            <div class="ds-search-input ds-search-input--pill" data-ds-search-input data-pill data-has-end-adornment>
              <span class="ds-search-input__icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17.5 17.5L22 22" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
              </span>
              <input type="text" class="ds-search-input__field" value="${esc(historySearchQ)}" placeholder="Search case ID, actor, detail..." data-ux-hist-search aria-label="Filter history logs" />
              <button type="button" class="ds-search-input__clear" aria-label="Clear search" ${historySearchQ ? '' : 'hidden'}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 5L5 19M5 5L19 19" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
              </button>
            </div>

            <div class="ds-filter" data-ds-filter data-label="Actor" data-ux-hist-actor>
              <button type="button" class="ds-filter__trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Filter logs by actor">
                <span data-ds-filter-value>Actor</span>
                <span class="ds-filter__clear" role="button" tabindex="0" aria-label="Clear current value" hidden>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 5L5 19M5 5L19 19" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
                </span>
              </button>
              <div class="ds-filter__menu" role="listbox" aria-label="Filter by actor" hidden>
                <div class="ds-filter__list ds-scrollbar"></div>
              </div>
            </div>

            <div class="ds-filter" data-ds-filter data-label="Case" data-ux-hist-case>
              <button type="button" class="ds-filter__trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Filter logs by case">
                <span data-ds-filter-value>Case</span>
                <span class="ds-filter__clear" role="button" tabindex="0" aria-label="Clear current value" hidden>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 5L5 19M5 5L19 19" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
                </span>
              </button>
              <div class="ds-filter__menu" role="listbox" aria-label="Filter by case" hidden>
                <div class="ds-filter__list ds-scrollbar"></div>
              </div>
            </div>

            <button type="button" class="ds-filter-reset" data-ds-filter-reset aria-label="Clear all filters" hidden>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 5L5 19M5 5L19 19" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            </button>
          </div>

          <div class="ds-filter-bar__actions">
            <div class="ds-segmented ds-segmented--sm" data-ds-segmented data-size="sm" data-ux-hist-segmented role="tablist" aria-label="Filter logs by category">
              <div class="ds-segmented__thumb"></div>
              ${['ALL', 'ANALYSIS', 'REPORT', 'NEGO', 'NOTIFY', 'CHAT', 'OTHER'].map((t) => {
                const active = historyFilterType === t;
                return `<button type="button" role="tab" data-value="${t}" aria-selected="${active}" aria-checked="${active}" aria-pressed="${active}" data-state="${active ? 'on' : 'off'}">${t}</button>`;
              }).join('')}
            </div>
          </div>
        </div>
        <div class="ds-table-wrap ds-workspace-table ux-tab-stage" tabindex="0" role="region" aria-label="Activity history" data-ux-hist-stage>
          <table class="ds-table" aria-label="Activity log">
            <thead><tr><th>Time</th><th>Case ID</th><th>Category</th><th>Actor</th><th>Detail</th></tr></thead>
            <tbody data-ux-hist-tbody></tbody>
          </table>
        </div>
      `;
      bridge.mountDs?.(sec);
      const histStageEl = sec.querySelector('[data-ux-hist-stage]');
      const histSeg = sec.querySelector('[data-ux-hist-segmented]');
      bindZeroJumpTabStage({
        tabsEl: histSeg,
        stageEl: histStageEl,
        scrollEl: histStageEl,
      });
      histSeg?.addEventListener('ds-change', (e) => {
        if (e.detail?.value && e.detail.value !== historyFilterType) {
          historyFilterType = e.detail.value;
          renderHistoryRows();
        }
      });
      const histSearchEl = sec.querySelector('[data-ux-hist-search]');
      const histClearEl = histSearchEl?.closest('[data-ds-search-input]')?.querySelector('.ds-search-input__clear');
      histSearchEl?.addEventListener('input', (e) => {
        historySearchQ = e.target.value.trim().toLowerCase();
        renderHistoryRows();
      });
      histClearEl?.addEventListener('click', () => {
        historySearchQ = '';
        renderHistoryRows();
      });
      sec.querySelector('[data-ux-hist-actor]')?.addEventListener('ds-change', (e) => {
        historyActorFilter = e.detail?.value || 'all';
        renderHistoryRows();
      });
      sec.querySelector('[data-ux-hist-case]')?.addEventListener('ds-change', (e) => {
        historyCaseFilter = e.detail?.value || 'all';
        renderHistoryRows();
      });
      sec.querySelector('[data-ux-hist-shell] [data-ds-filter-reset]')?.addEventListener('click', () => {
        historySearchQ = '';
        historyActorFilter = 'all';
        historyCaseFilter = 'all';
        queueMicrotask(renderHistoryRows);
      });
    } else {
      const searchEl = sec.querySelector('[data-ux-hist-search]');
      if (searchEl && document.activeElement !== searchEl && searchEl.value !== historySearchQ) {
        searchEl.value = historySearchQ;
        const clearBtn = searchEl.closest('[data-ds-search-input]')?.querySelector('.ds-search-input__clear');
        if (clearBtn) clearBtn.hidden = !historySearchQ;
      }
    }

    bindSingleSelectFilterList(sec.querySelector('[data-ux-hist-actor] .ds-filter__list'), actorOptions, historyActorFilter);
    bindSingleSelectFilterList(sec.querySelector('[data-ux-hist-case] .ds-filter__list'), caseOptions, historyCaseFilter);
    renderHistoryRows();
  };

  let archivedSearchQ = '';
  let archivedStageFilter = 'all';
  let archivedScenarioFilter = 'all';
  let archivedViewMode = 'list';
  const ARCHIVED_STAGE_OPTIONS = [
    ['all', 'All stages'],
    ['pending_analysis', 'Queued'],
    ['analyzing', 'Analysing'],
    ['undetermined', 'Needs input'],
    ['pending_chart', 'Select scenario'],
    ['pending_report', 'Confirm baseline'],
    ['negotiating', 'Negotiating'],
    ['agreed', 'Settled'],
    ['closed', 'Closed'],
  ];
  const ARCHIVED_SCENARIO_OPTIONS = [
    ['all', 'All scenarios'],
    ['pending', 'Pending'],
    ...KNIA_CHART_CATALOG.map((ch) => [ch.code, scenarioLabel(ch)]),
  ];

  const renderArchivedView = () => {
    const sec = viewSections.archived;
    if (!sec) return;

    if (!sec.querySelector('[data-ux-arch-shell]')) {
      sec.innerHTML = `
        <header class="ds-workspace-header"><h1 class="ds-workspace-header__title">Archived cases</h1></header>
        <div class="ds-filter-bar ds-workspace-toolbar" role="toolbar" aria-label="Archived cases controls" data-ux-arch-shell>
          <div class="ds-filter-bar__group">
            <div class="ds-search-input ds-search-input--pill" data-ds-search-input data-pill data-has-end-adornment>
              <span class="ds-search-input__icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17.5 17.5L22 22" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
              </span>
              <input type="text" class="ds-search-input__field" data-ux-arch-search placeholder="Search archived cases..." aria-label="Search archived cases" />
              <button type="button" class="ds-search-input__clear" aria-label="Clear search" hidden>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 5L5 19M5 5L19 19" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
              </button>
            </div>

            <div class="ds-filter" data-ds-filter data-label="Stage" data-ux-arch-stage data-case-state-filter>
              <button type="button" class="ds-filter__trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Filter archived cases by stage">
                <span data-ds-filter-value>Stage</span>
                <span class="ds-filter__clear" role="button" tabindex="0" aria-label="Clear current value" hidden>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 5L5 19M5 5L19 19" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
                </span>
              </button>
              <div class="ds-filter__menu" role="listbox" aria-label="Filter by stage" hidden>
                <div class="ds-filter__list ds-scrollbar">
                  ${ARCHIVED_STAGE_OPTIONS.map(([val, text], idx) => `
                    <button type="button" class="ds-filter__item" role="option" data-value="${esc(val)}" aria-selected="${idx === 0}"${idx === 0 ? ' data-checked="true"' : ''}>
                      <span class="ds-filter__check${idx === 0 ? '' : ' ds-filter__check--empty'}" aria-hidden="true">${idx === 0 ? ICON_CHECK : ''}</span>
                      <span>${esc(text)}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>

            <div class="ds-filter" data-ds-filter data-label="Scenario" data-ux-arch-scenario>
              <button type="button" class="ds-filter__trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Filter archived cases by scenario">
                <span data-ds-filter-value>Scenario</span>
                <span class="ds-filter__clear" role="button" tabindex="0" aria-label="Clear current value" hidden>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 5L5 19M5 5L19 19" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
                </span>
              </button>
              <div class="ds-filter__menu" role="listbox" aria-label="Filter by scenario" hidden>
                <div class="ds-search-input ux-filter__search" data-ds-search-input data-has-end-adornment>
                  <span class="ds-search-input__icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17.5 17.5L22 22" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
                  </span>
                  <input type="text" class="ds-search-input__field" placeholder="Search scenarios..." aria-label="Search scenarios" />
                  <button type="button" class="ds-search-input__clear" aria-label="Clear scenario search" hidden>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 5L5 19M5 5L19 19" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
                  </button>
                </div>
                <div class="ds-filter__list ds-scrollbar">
                  ${ARCHIVED_SCENARIO_OPTIONS.map(([val, text], idx) => `
                    <button type="button" class="ds-filter__item" role="option" data-value="${esc(val)}" aria-selected="${idx === 0}"${idx === 0 ? ' data-checked="true"' : ''}>
                      <span class="ds-filter__check${idx === 0 ? '' : ' ds-filter__check--empty'}" aria-hidden="true">${idx === 0 ? ICON_CHECK : ''}</span>
                      <span>${esc(text)}</span>
                    </button>
                  `).join('')}
                </div>
                <div class="ux-filter-empty" data-ux-filter-empty hidden>No matching scenarios</div>
              </div>
            </div>

            <button type="button" class="ds-filter-reset" data-ds-filter-reset aria-label="Clear all filters" hidden>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 5L5 19M5 5L19 19" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            </button>
          </div>

          <div class="ds-filter-bar__actions">
            <div class="ds-segmented ux-case-view-tabs" data-ds-segmented data-ux-arch-view role="radiogroup" aria-label="Archived cases display mode">
              <div class="ds-segmented__thumb"></div>
              <button type="button" role="radio" aria-checked="true" aria-pressed="true" data-state="on" data-value="list" aria-label="List view" title="List view">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M1.25 1.25H22.75V6.75H1.25V1.25Z" fill="currentColor"/>
                  <path d="M1.25 9.25H22.75V14.75H1.25V9.25Z" fill="currentColor"/>
                  <path d="M1.25 17.25H22.75V22.75H1.25V17.25Z" fill="currentColor"/>
                </svg>
              </button>
              <button type="button" role="radio" aria-checked="false" aria-pressed="false" data-state="off" data-value="grid" aria-label="Grid view" title="Grid view">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M1.25 2C1.25 1.58579 1.58579 1.25 2 1.25H10C10.4142 1.25 10.75 1.58579 10.75 2V10C10.75 10.4142 10.4142 10.75 10 10.75H2C1.58579 10.75 1.25 10.4142 1.25 10V2Z" fill="currentColor"/>
                  <path d="M13.25 2C13.25 1.58579 13.5858 1.25 14 1.25H22C22.4142 1.25 22.75 1.58579 22.75 2V10C22.75 10.4142 22.4142 10.75 22 10.75H14C13.5858 10.75 13.25 10.4142 13.25 10V2Z" fill="currentColor"/>
                  <path d="M13.25 14C13.25 13.5858 13.5858 13.25 14 13.25H22C22.4142 13.25 22.75 13.5858 22.75 14V22C22.75 22.4142 22.4142 22.75 22 22.75H14C13.5858 22.75 13.25 22.4142 13.25 22V14Z" fill="currentColor"/>
                  <path d="M1.25 14C1.25 13.5858 1.58579 13.25 2 13.25H10C10.4142 13.25 10.75 13.5858 10.75 14V22C10.75 22.4142 10.4142 22.75 10 22.75H2C1.58579 22.75 1.25 22.4142 1.25 22V14Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="ds-table-wrap ds-workspace-table" tabindex="0" role="region" aria-label="Archived cases table">
          <table class="ds-table" data-ux-arch-table aria-label="Archived cases">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>License plate</th>
                <th>Stage</th>
                <th>Accident scenario</th>
                <th>Base ratio</th>
                <th class="ds-table__col-actions"></th>
              </tr>
            </thead>
            <tbody data-ux-arch-tbody>
              <tr class="ds-table__empty-row" data-ux-arch-empty hidden>
                <td colspan="6" class="ds-table__empty-cell">No archived cases</td>
              </tr>
            </tbody>
          </table>
          <div class="ux-case-grid" data-ux-arch-grid hidden></div>
          <div class="ux-case-grid-empty" data-ux-arch-grid-empty hidden>No archived cases</div>
        </div>
      `;

      bridge.mountDs?.(sec);

      const archSearchEl = sec.querySelector('[data-ux-arch-search]');
      const archClearEl = archSearchEl?.closest('[data-ds-search-input]')?.querySelector('.ds-search-input__clear');
      const archStageEl = sec.querySelector('[data-ux-arch-stage]');
      const archScenarioEl = sec.querySelector('[data-ux-arch-scenario]');
      const archViewEl = sec.querySelector('[data-ux-arch-view]');
      bindFilterMenuSearch(archScenarioEl?.querySelector('.ds-filter__menu'));

      archSearchEl?.addEventListener('input', (e) => {
        archivedSearchQ = e.target.value.trim().toLowerCase();
        renderArchivedView();
      });
      archClearEl?.addEventListener('click', () => {
        archivedSearchQ = '';
        renderArchivedView();
      });
      archStageEl?.addEventListener('ds-change', (e) => {
        archivedStageFilter = e.detail?.value || 'all';
        renderArchivedView();
      });
      archScenarioEl?.addEventListener('ds-change', (e) => {
        archivedScenarioFilter = e.detail?.value || 'all';
        renderArchivedView();
      });
      sec.querySelector('[data-ux-arch-shell] [data-ds-filter-reset]')?.addEventListener('click', () => {
        archivedSearchQ = '';
        archivedStageFilter = 'all';
        archivedScenarioFilter = 'all';
        queueMicrotask(renderArchivedView);
      });
      archViewEl?.addEventListener('ds-change', (e) => {
        archivedViewMode = e.detail?.value === 'grid' ? 'grid' : 'list';
        renderArchivedView();
      });
    }

    const tbodyEl = sec.querySelector('[data-ux-arch-tbody]');
    const tableEl = sec.querySelector('[data-ux-arch-table]');
    const emptyRowEl = sec.querySelector('[data-ux-arch-empty]');
    const gridEl = sec.querySelector('[data-ux-arch-grid]');
    const gridEmptyEl = sec.querySelector('[data-ux-arch-grid-empty]');
    if (!tbodyEl || !tableEl || !gridEl) return;

    tbodyEl.querySelectorAll('tr[data-arch-row]').forEach((r) => r.remove());

    const isGrid = archivedViewMode === 'grid';
    tableEl.hidden = isGrid;
    gridEl.hidden = !isGrid;

    const allArchived = store.cases.filter((c) => c.archived);
    const filtered = allArchived.filter((c) => {
      const stageInfo = STAGE_META[c.stage] || STAGE_META.pending_chart;
      const scenarioTitle = getCaseScenarioTitle(c);
      const matchesStage = archivedStageFilter === 'all' || c.stage === archivedStageFilter || String(stageInfo.step) === archivedStageFilter;
      const matchesScenario = archivedScenarioFilter === 'all' || (c.selectedChart || 'pending') === archivedScenarioFilter;
      const haystack = `${c.id} ${c.plate} ${c.scenario || ''} ${c.selectedChart || ''} ${scenarioTitle} ${stageInfo.label} ${c.baseRatio}`.toLowerCase();
      const matchesSearch = !archivedSearchQ || haystack.includes(archivedSearchQ);
      return matchesStage && matchesScenario && matchesSearch;
    });

    const restoreBtnHtml = (caseId) => `
      <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" data-ux-restore="${esc(caseId)}" aria-label="Restore ${esc(caseId)}" title="Restore">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.2716 2 18.1763 3.57111 20.0007 6V2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
      </button>
    `;
    const cardRestoreBtnHtml = (caseId) => `
      <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm ux-case-grid-card__action" data-ux-restore="${esc(caseId)}" aria-label="Restore ${esc(caseId)}" title="Restore">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.2716 2 18.1763 3.57111 20.0007 6V2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
      </button>
    `;

    const gridCardsHtml = [];
    filtered.forEach((c, idx) => {
      const stageInfo = STAGE_META[c.stage] || STAGE_META.pending_chart;
      const scenarioTitle = getCaseScenarioTitle(c);
      const thumbSrc = c.thumb || `./assets/video-thumbs/cam-0${(idx % 4) + 1}.jpg`;
      const rowPlacement = idx === 0 ? 'bottom-start' : 'top-start';
      const tr = document.createElement('tr');
      tr.dataset.archRow = '';
      tr.dataset.caseId = c.id;
      tr.tabIndex = 0;
      tr.innerHTML = `
        <td>
          <div class="ux-case-id-cell">
            <span class="ux-case-row-thumb" aria-hidden="true">
              <img class="ux-case-row-thumb__img" src="${esc(thumbSrc)}" alt="" decoding="async" />
            </span>
            <code>${esc(c.id)}</code>
          </div>
        </td>
        <td>${esc(c.plate)}</td>
        <td><span class="ds-badge ds-badge--pill ${stageInfo.badge}">${esc(stageInfo.label)}</span></td>
        <td>
          <div class="ux-case-scenario-cell">
            ${renderScenarioPillTooltipHtml(c, rowPlacement)}
            <span class="ux-case-scenario-cell__title">${esc(scenarioTitle)}</span>
          </div>
        </td>
        <td>
          <div class="ds-ratio-cell">
            ${renderSplitBarHtml({
              cls: 'ds-progress-bar ux-ratio-bar--sm ux-ratio-bar--neutral',
              role: 'progressbar',
              ariaLabel: `Base ratio ${c.baseRatio}`,
              valuenow: c.baseInsuredPct,
            })}
            <span class="ds-ratio-cell__value">${esc(c.baseRatio)}</span>
          </div>
        </td>
        <td class="ds-table__col-actions">${restoreBtnHtml(c.id)}</td>
      `;
      tr.querySelector('.ux-ratio-bar')?.style.setProperty('--ratio-a', String(clampRatioUnit(c.baseInsuredPct)));
      tbodyEl.insertBefore(tr, emptyRowEl || null);

      gridCardsHtml.push(renderCaseGridCardHtml({
        c,
        thumbSrc,
        stageInfo,
        actionBtnHtml: cardRestoreBtnHtml(c.id),
        cardAttr: 'data-arch-card',
        includeFilters: false,
      }));
    });

    gridEl.innerHTML = gridCardsHtml.join('');
    gridEl.querySelectorAll('.ux-ratio-bar').forEach((barEl) => {
      barEl.style.setProperty('--ratio-a', String(clampRatioUnit(barEl.getAttribute('aria-valuenow'))));
    });

    const emptyLabel = allArchived.length === 0 ? 'No archived cases' : 'No matching archived cases';
    if (emptyRowEl) {
      const emptyCell = emptyRowEl.querySelector('.ds-table__empty-cell');
      if (emptyCell) emptyCell.textContent = emptyLabel;
      emptyRowEl.hidden = isGrid || filtered.length > 0;
    }
    if (gridEmptyEl) {
      gridEmptyEl.textContent = emptyLabel;
      gridEmptyEl.hidden = !isGrid || filtered.length > 0;
    }

    sec.querySelectorAll('[data-ux-restore]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const c = getCase(btn.dataset.uxRestore);
        if (!c) return;
        c.archived = false;
        logActivity(c.id, 'OTHER', 'Restored case from Archive', 'Adjuster');
        renderCaseQueueRows();
        renderArchivedView();
      });
    });

    sec.querySelectorAll('tr[data-arch-row], [data-arch-card]').forEach((el) => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('button, a, input, select, textarea, label, [role="tooltip"], .ux-case-knia-pill')) return;
        if (el.dataset.caseId) openCaseWorkbench(el.dataset.caseId, true);
      });
      el.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        if (e.target.closest('button, a, input, select, textarea, label, [role="tooltip"], .ux-case-knia-pill')) return;
        e.preventDefault();
        if (el.dataset.caseId) openCaseWorkbench(el.dataset.caseId, true);
      });
    });
  };

  const renderRuleManagementView = () => {
    const sec = viewSections['rule-management'];
    if (!sec) return;
    sec.innerHTML = `
      <header class="ds-workspace-header"><h1 class="ds-workspace-header__title">Rule Management</h1></header>
      <div class="ux-view-scroll">
        <div class="ux-page-container">
          <div class="ux-empty-card">
            <div class="ds-platform-empty">
              <div class="ds-platform-empty__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M7.99908 22V22.75H8.30974L8.52941 22.5303L7.99908 22ZM21.9991 8L22.5294 8.53033C22.8223 8.23744 22.8223 7.76256 22.5294 7.46967L21.9991 8ZM2 16L1.46965 15.4697L1.25 15.6894V16H2ZM15.9991 2L16.5294 1.46967C16.3888 1.32901 16.198 1.25 15.9991 1.25C15.8001 1.25 15.6094 1.32903 15.4687 1.46969L15.9991 2ZM2 22H1.25V22.75H2V22ZM8.52941 22.5303L22.5294 8.53033L21.4687 7.46967L7.46875 21.4697L8.52941 22.5303ZM2.53035 16.5303L16.5294 2.53031L15.4687 1.46969L1.46965 15.4697L2.53035 16.5303ZM15.4687 2.53033L21.4687 8.53033L22.5294 7.46967L16.5294 1.46967L15.4687 2.53033ZM7.99908 21.25H2V22.75H7.99908V21.25ZM2.75 22V16H1.25V22H2.75Z" fill="currentColor"/><path d="M12 6L18 12" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M13 22L22 22" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
              </div>
              <strong>No rule data yet</strong>
              <p>Rule governance tables, divergence reviews, and proposals will appear here once datasets are connected.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // ── Case Workbench Entry Point ──
  const openCaseWorkbench = (caseId, respectClosedPrompt = true) => {
    const c = getCase(caseId);
    if (!c) return;
    if (respectClosedPrompt && c.isClosed) {
      const dlg = dialogs.closedEntry;
      if (dlg) {
        dlg.dataset.pendingCaseId = c.id;
        dlg.querySelector('[data-ux-closed-summary]').textContent = `${c.id} · ${c.plate} is closed. Open in read-only mode or reopen to edit.`;
        openDialogSmooth(dlg);
        return;
      }
    }
    store.activeCaseId = c.id;
    store.activeConditionTarget = null;
    store.activeStep2EvidenceTag = null;
    store.evidenceDraft = null;
    hideCondThumbTip();
    closeStep1ReanalyseSheet({ discardDraft: true });
    bridge.setTimelineDraftMode?.(false);
    clearTimelineRangeFocus(null, false);
    bridge.stopCaseAnalysis();
    bridge.stopStep2Analysis?.();
    bridge.stopStep3Analysis?.();
    renderStageOverlay(null);
    setActiveNavView('case-detail');
    syncDetailSwitcherActiveState();
    syncCaseClosedControls(c);
    const targetInitialSec = isRawVideoState(c) ? 0 : 12.4;
    lastCam1RefSec = targetInitialSec;
    bridge.setVideoPlaying(false);
    const firstPresentCam = (c.videos || []).find((v) => v.present);
    bridge.setActiveCamera(String(firstPresentCam ? firstPresentCam.slot : 1));
    bridge.setScrubberValue(targetInitialSec);
    if (bridge.detailCaseIdEl) bridge.detailCaseIdEl.textContent = c.id;
    const stageInfo = STAGE_META[c.stage] || STAGE_META.pending_chart;

    const initialStep = !c.analysisDone ? 1 : (stageInfo.step || 1);
    if (analysingEl) delete analysingEl.dataset.renderedKey;
    if (step2AnalysingEl) delete step2AnalysingEl.dataset.renderedKey;
    if (step3AnalysingEl) delete step3AnalysingEl.dataset.renderedKey;
    selectStep(initialStep);
    requestAnimationFrame(bridge.syncVideoTabsThumb);
  };

  tableBody?.addEventListener('click', (e) => {
    const archBtn = e.target.closest('[data-action="archive-case"]');
    if (archBtn) {
      e.stopPropagation();
      const row = archBtn.closest('tr[data-case-row]');
      const caseId = row?.dataset.caseId || row?.querySelector('code')?.textContent?.trim();
      const c = getCase(caseId);
      if (c) { c.archived = true; logActivity(c.id, 'OTHER', 'Archived case', 'Adjuster'); renderCaseQueueRows(); }
      return;
    }
    if (e.target.closest('button, a, input, select, textarea, label, [role="tooltip"], .ux-case-knia-pill')) return;
    const row = e.target.closest('tr[data-case-row]');
    const caseId = row?.dataset.caseId || row?.querySelector('code')?.textContent?.trim();
    if (caseId) openCaseWorkbench(caseId, true);
  }, true);

  tableBody?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (e.target.closest('button, a, input, select, textarea, label, [role="tooltip"], .ux-case-knia-pill')) return;
    const row = e.target.closest('tr[data-case-row]');
    if (!row) return;
    e.preventDefault();
    const caseId = row.dataset.caseId || row.querySelector('code')?.textContent?.trim();
    if (caseId) openCaseWorkbench(caseId, true);
  });

  caseGridEl?.addEventListener('click', (e) => {
    const archBtn = e.target.closest('[data-action="archive-case"]');
    if (archBtn) {
      e.stopPropagation();
      const card = archBtn.closest('[data-case-card]');
      const caseId = card?.dataset.caseId;
      const c = getCase(caseId);
      if (c) { c.archived = true; logActivity(c.id, 'OTHER', 'Archived case', 'Adjuster'); renderCaseQueueRows(); }
      return;
    }
    if (e.target.closest('button, a, input, select, textarea, label, [role="tooltip"], .ux-case-knia-pill')) return;
    const card = e.target.closest('[data-case-card]');
    const caseId = card?.dataset.caseId;
    if (caseId) openCaseWorkbench(caseId, true);
  }, true);

  caseGridEl?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (e.target.closest('button, a, input, select, textarea, label, [role="tooltip"], .ux-case-knia-pill')) return;
    const card = e.target.closest('[data-case-card]');
    if (!card) return;
    e.preventDefault();
    const caseId = card.dataset.caseId;
    if (caseId) openCaseWorkbench(caseId, true);
  });

  const caseSearchInputEl = document.querySelector('[data-case-search]');
  const caseSearchClearEl = caseSearchInputEl?.closest('[data-ds-search-input]')?.querySelector('.ds-search-input__clear');
  const caseStateFilterEl = document.querySelector('[data-case-state-filter]');
  const caseScenarioFilterEl = document.querySelector('[data-case-scenario-filter]');
  const caseFaultFilterEl = document.querySelector('[data-case-fault-filter]');
  const caseFilterResetEl = document.querySelector('[data-view="cases"] [data-ds-filter-reset]');
  const caseViewTabsEl = document.querySelector('[data-case-view-tabs]');
  caseSearchInputEl?.addEventListener('input', () => {
    homePage = 1;
    queueMicrotask(syncHomePagination);
  });
  caseSearchClearEl?.addEventListener('click', () => {
    homePage = 1;
    queueMicrotask(syncHomePagination);
  });
  caseStateFilterEl?.addEventListener('ds-change', () => {
    homePage = 1;
    queueMicrotask(syncHomePagination);
  });
  caseScenarioFilterEl?.addEventListener('ds-change', () => {
    homePage = 1;
    queueMicrotask(syncHomePagination);
  });
  caseFaultFilterEl?.addEventListener('ds-change', () => {
    homePage = 1;
    queueMicrotask(syncHomePagination);
  });
  caseFilterResetEl?.addEventListener('click', () => {
    homePage = 1;
    queueMicrotask(syncHomePagination);
  });
  caseViewTabsEl?.addEventListener('ds-change', () => {
    queueMicrotask(syncHomePagination);
  });

  document.querySelector('[data-action="reload-cases"]')?.addEventListener('click', () => {
    renderCaseQueueRows();
  });

  bridge.detailSwitcher?.addEventListener('ds-change', (e) => {
    const nextId = e.detail?.value;
    if (nextId && nextId !== store.activeCaseId) openCaseWorkbench(nextId, true);
  });

  renderCaseQueueRows();
  wireAllModals();

  return {
    openCaseWorkbench,
    selectStep,
    setActiveNavView,
    closeStep1ReanalyseSheet,
    isStep1ReanalyseOpen: isTimelineSpotlightOpen,
    getStore: () => store,
  };
}
