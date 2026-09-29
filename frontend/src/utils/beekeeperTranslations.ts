export type BeekeeperLanguage = 'en' | 'hi';

export interface BeekeeperTranslationStrings {
  portalTitle: string;
  registeredBeekeeper: string;
  kvicRegistration: string;
  cooperative: string;
  assignedCluster: string;
  logHarvestBtn: string;
  selectHive: string;
  switchLanguage: string;
  
  // Priority 1: Hive Health
  hiveHealthTitle: string;
  hiveHealthSubtitle: string;
  overallHealthLabel: string;
  healthGood: string;
  healthWarning: string;
  healthCritical: string;
  diseaseRiskLabel: string;
  possibleDiseaseRiskTitle: string;
  riskLow: string;
  riskMedium: string;
  riskHigh: string;
  whatToDoTitle: string;
  whatToDoCheckActivity: string;
  whatToDoCheckSigns: string;
  whatToDoObserve: string;
  whatToDoContactExpert: string;
  colonyStatusLabel: string;
  colonyNormal: string;
  colonySwarmWarning: string;
  colonyQueenLossWarning: string;
  beekeeperTipTitle: string;
  defaultTip: string;
  tipWarm: string;
  tipWeightDrop: string;
  tipHealthy: string;
  
  // Priority 2: Notifications & Alerts
  alertsTitle: string;
  alertsSubtitle: string;
  activeAlertsBadge: string;
  noAlertsMessage: string;
  filterAll: string;
  filterNew: string;
  filterResolved: string;
  statusNew: string;
  statusResolved: string;
  markResolvedBtn: string;
  resolvedSuccessMsg: string;
  alertHighTempTitle: string;
  alertLowTempTitle: string;
  alertHumidityTitle: string;
  alertWeightDropTitle: string;
  alertDiseaseRiskTitle: string;
  alertSensorOfflineTitle: string;
  alertUnusualTitle: string;
  hiveLabel: string;
  recommendedLabel: string;
  recommendedTempAction: string;
  recommendedWeightAction: string;
  recommendedSwarmAction: string;
  testScenariosLabel: string;
  testHeatwave: string;
  testWeightDrop: string;
  testSwarm: string;
  
  // Priority 3: Expected Honey & Yield Forecaster
  expectedHoneyTitle: string;
  expectedHoneySubtitle: string;
  estimatedHarvestLabel: string;
  expectedReadyLabel: string;
  expectedHarvestWindowLabel: string;
  forecastConfidenceLabel: string;
  currentHiveWeightLabel: string;
  weightTrendLabel: string;
  hiveHealthLabel: string;
  whyForecastTitle: string;
  whyForecastSubtitle: string;
  demoAiForecastBadge: string;
  harvestDisclaimer: string;
  normalSeasonalRangeLabel: string;
  confidenceLabel: string;
  outlookGood: string;
  outlookGrowing: string;
  harvestTip: string;
  
  // Priority 4: Hive Sensor Data
  sensorDataTitle: string;
  sensorDataSubtitle: string;
  sensorOnlineBadge: string;
  sensorOfflineBadge: string;
  noSensorConnectedBadge: string;
  registerNewHiveBtn: string;
  temperatureLabel: string;
  temperatureNote: string;
  humidityLabel: string;
  humidityNote: string;
  weightLabel: string;
  weightNote: string;
  soundLabel: string;
  soundNote: string;
  statusComfortable: string;
  statusTooHigh: string;
  statusTooLow: string;
  statusSteady: string;
  statusCalm: string;
  statusAgitated: string;
  lastUpdatedLabel: string;
  
  // Priority 5: Recent Activity & Harvested Batches
  recentActivityTitle: string;
  recentActivitySubtitle: string;
  batchesHarvestedCard: string;
  assignedHivesCard: string;
  predominantFloraCard: string;
  noBatchesMessage: string;
  noBatchesForHive: string;
  logFirstBatchLink: string;
  thBatchId: string;
  thFlora: string;
  thHarvestDate: string;
  thQuantity: string;
  thStatus: string;
  thVerificationQr: string;
  viewTokenLink: string;
  
  // Assigned Hives Details
  hivesListTitle: string;
  thHiveCode: string;
  thBeeSpecies: string;
  thInstallDate: string;
  thLocation: string;
  thNotes: string;
  thColonyStatus: string;
  
  // Modal: Log Harvest
  modalTitle: string;
  modalSuccessTitle: string;
  modalSuccessSubtitle: string;
  blockchainProofLabel: string;
  labelSelectHive: string;
  selectHiveHint: string;
  labelQuantityKg: string;
  labelHarvestDate: string;
  labelFloralSource: string;
  labelFieldNotes: string;
  fieldNotesPlaceholder: string;
  btnCancel: string;
  btnRecordHarvest: string;
  btnDone: string;
  submittingHarvest: string;

  // Demo Video & Tutorial
  demoVideoBtn: string;
  demoVideoModalTitle: string;
  demoVideoModalSubtitle: string;
  demoVideoBadge: string;
  demoVideoOpenNewTab: string;
  demoVideoClose: string;
  demoVideoTutorialGuide: string;
  demoVideoPoint1: string;
  demoVideoPoint2: string;
  demoVideoPoint3: string;
}

export const BEEKEEPER_TRANSLATIONS: Record<BeekeeperLanguage, BeekeeperTranslationStrings> = {
  en: {
    portalTitle: 'Beekeeper Dashboard',
    registeredBeekeeper: 'Registered Beekeeper',
    kvicRegistration: 'KVIC Registration',
    cooperative: 'Cooperative',
    assignedCluster: 'Assigned Cluster',
    logHarvestBtn: 'Log Honey Harvest',
    selectHive: 'Select Hive',
    switchLanguage: 'Language',
    
    // Priority 1: Hive Health
    hiveHealthTitle: 'Hive Health',
    hiveHealthSubtitle: 'Current condition and well-being of your bee colony',
    overallHealthLabel: 'Overall Health',
    healthGood: 'Good Condition',
    healthWarning: 'Needs Attention',
    healthCritical: 'Immediate Care Needed',
    diseaseRiskLabel: 'Disease Risk',
    possibleDiseaseRiskTitle: 'Possible Disease Risk',
    riskLow: 'Low (Safe)',
    riskMedium: 'Moderate',
    riskHigh: 'High Risk',
    whatToDoTitle: 'What to do',
    whatToDoCheckActivity: 'Check the hive and bee activity.',
    whatToDoCheckSigns: 'Look for unusual bee behaviour or visible signs.',
    whatToDoObserve: 'Keep the affected hive under observation.',
    whatToDoContactExpert: 'Contact a local beekeeping expert/veterinarian for confirmation before treatment.',
    colonyStatusLabel: 'Colony & Queen Status',
    colonyNormal: 'Queen bee is active, colony working normally',
    colonySwarmWarning: 'Colony may be preparing to swarm — inspect queen cups',
    colonyQueenLossWarning: 'Queen activity is low — inspect brood frames',
    beekeeperTipTitle: 'Care Recommendation',
    defaultTip: 'Colony is active. Keep clean water nearby and maintain adequate hive ventilation.',
    tipWarm: 'Hive temperature is elevated. Provide shade over the roof during peak sun hours.',
    tipWeightDrop: 'Weight decreased noticeably. Check hive box for forage supply and comb health.',
    tipHealthy: 'Optimal hive health. Good flight activity observed at the entrance.',
    
    // Priority 2: Notifications & Alerts
    alertsTitle: 'Hive Notifications & Alerts',
    alertsSubtitle: 'Important warnings and updates about your monitored hives',
    activeAlertsBadge: 'Active Alerts',
    noAlertsMessage: 'All your hives are healthy and safe. No active warnings.',
    filterAll: 'All Alerts',
    filterNew: 'New Alerts',
    filterResolved: 'Resolved',
    statusNew: 'New',
    statusResolved: 'Resolved',
    markResolvedBtn: 'Mark Resolved',
    resolvedSuccessMsg: 'Alert marked as resolved.',
    alertHighTempTitle: 'Hive temperature is higher than normal',
    alertLowTempTitle: 'Hive temperature is lower than normal',
    alertHumidityTitle: 'Hive humidity is outside safe range',
    alertWeightDropTitle: 'Sudden hive weight change detected',
    alertDiseaseRiskTitle: 'Possible disease or colony risk detected',
    alertSensorOfflineTitle: 'Hive sensor is offline',
    alertUnusualTitle: 'Something looks unusual in this hive',
    hiveLabel: 'Hive',
    recommendedLabel: 'Recommended',
    recommendedTempAction: 'Check the hive and monitor temperature.',
    recommendedWeightAction: 'Check the hive and check for sudden loss or disturbance.',
    recommendedSwarmAction: 'Check for queen cells or prepare swarm collection box.',
    testScenariosLabel: 'Test Hive Alert Scenarios (Demo):',
    testHeatwave: 'Trigger High Temp Alert',
    testWeightDrop: 'Trigger Weight Drop Alert',
    testSwarm: 'Trigger Swarm Warning',
    
    // Priority 3: Expected Honey & Yield Forecaster
    expectedHoneyTitle: 'Expected Honey (Yield Forecaster)',
    expectedHoneySubtitle: 'Estimated honey production and harvest readiness for the selected hive',
    estimatedHarvestLabel: 'Estimated Honey Yield',
    expectedReadyLabel: 'Expected Ready',
    expectedHarvestWindowLabel: 'Expected Harvest Window',
    forecastConfidenceLabel: 'Forecast Confidence',
    currentHiveWeightLabel: 'Current Hive Weight',
    weightTrendLabel: 'Weight Trend',
    hiveHealthLabel: 'Hive Health',
    whyForecastTitle: 'Why this forecast?',
    whyForecastSubtitle: 'Forecast is based on recent hive weight increase, bee activity, temperature, humidity and previous production patterns.',
    demoAiForecastBadge: 'DEMO / SIMULATED AI FORECAST',
    harvestDisclaimer: 'Estimated forecast only, not a guarantee. Check that combs are at least 80% capped before extraction.',
    normalSeasonalRangeLabel: 'Normal Seasonal Range',
    confidenceLabel: 'Confidence',
    outlookGood: 'Healthy nectar flow and stable foraging conditions.',
    outlookGrowing: 'Colony is building comb and strength for peak season.',
    harvestTip: 'Harvest only sealed, capped combs to preserve natural moisture balance below 20%.',
    
    // Priority 4: Hive Sensor Data
    sensorDataTitle: 'Hive Sensor Data',
    sensorDataSubtitle: 'Live readings from smart sensors inside the hive box',
    sensorOnlineBadge: 'Sensor Online',
    sensorOfflineBadge: 'Sensor Offline',
    noSensorConnectedBadge: 'No sensor connected',
    registerNewHiveBtn: '+ Register New Hive',
    temperatureLabel: 'Hive Temperature',
    temperatureNote: 'Comfortable: 32°C – 36°C',
    humidityLabel: 'Hive Humidity',
    humidityNote: 'Comfortable: 55% – 70%',
    weightLabel: 'Hive Weight',
    weightNote: 'Total box & honey weight',
    soundLabel: 'Bee Activity (Sound)',
    soundNote: 'Normal buzzing frequency',
    statusComfortable: 'Normal',
    statusTooHigh: 'Higher than normal',
    statusTooLow: 'Lower than normal',
    statusSteady: 'Steady',
    statusCalm: 'Calm & Active',
    statusAgitated: 'Restless',
    lastUpdatedLabel: 'Last updated',
    
    // Priority 5: Recent Activity & Harvested Batches
    recentActivityTitle: 'Recent Activity & Harvest Batches',
    recentActivitySubtitle: 'Honey harvests logged and registered on BeeProof',
    batchesHarvestedCard: 'Batches Harvested',
    assignedHivesCard: 'Assigned Apiary Hives',
    predominantFloraCard: 'Predominant Flora',
    noBatchesMessage: 'No honey harvest batches logged yet.',
    noBatchesForHive: 'No harvest batches recorded for this hive yet.',
    logFirstBatchLink: 'Log your first harvest batch now',
    thBatchId: 'Batch ID',
    thFlora: 'Floral Source',
    thHarvestDate: 'Harvest Date',
    thQuantity: 'Quantity',
    thStatus: 'Status',
    thVerificationQr: 'Verification QR',
    viewTokenLink: 'View Token',
    
    // Assigned Hives Details
    hivesListTitle: 'My Assigned Hives',
    thHiveCode: 'Hive Code',
    thBeeSpecies: 'Bee Species',
    thInstallDate: 'Installation Date',
    thLocation: 'GPS Coordinates',
    thNotes: 'Field Notes',
    thColonyStatus: 'Status',
    
    // Modal: Log Harvest
    modalTitle: 'Log Honey Harvest',
    modalSuccessTitle: 'Harvest Successfully Logged!',
    modalSuccessSubtitle: 'Your honey harvest batch is now registered on-chain with verifiable provenance.',
    blockchainProofLabel: 'Blockchain Transaction Proof',
    labelSelectHive: 'Select Colony Hive',
    selectHiveHint: 'Only hives registered to your apiary account can be selected.',
    labelQuantityKg: 'Quantity Harvested (kg)',
    labelHarvestDate: 'Harvest Date',
    labelFloralSource: 'Floral Blossom Source',
    labelFieldNotes: 'Field Extraction Notes',
    fieldNotesPlaceholder: 'e.g. Pure raw comb harvest, cold filtered below 40°C',
    btnCancel: 'Cancel',
    btnRecordHarvest: 'Record Harvest Batch',
    btnDone: 'Done',
    submittingHarvest: 'Recording on Blockchain...',

    // Demo Video & Tutorial
    demoVideoBtn: 'Demo Video Guide',
    demoVideoModalTitle: 'Beekeeper Portal Tutorial & Demo Video',
    demoVideoModalSubtitle: 'Learn how to use your smartphone in the apiary to inspect hives, check sensor telemetry, and log honey harvests.',
    demoVideoBadge: 'VIDEO TUTORIAL',
    demoVideoOpenNewTab: 'Open in New Tab',
    demoVideoClose: 'Close Video',
    demoVideoTutorialGuide: 'Quick Video Walkthrough Highlights',
    demoVideoPoint1: 'Using smartphone app in the apiary for real-time hive data',
    demoVideoPoint2: 'Checking temperature, humidity, weight & bee activity scores',
    demoVideoPoint3: 'Registering new hives and generating verifiable harvest QR tokens'
  },
  hi: {
    portalTitle: 'मधुमक्खी पालक डैशबोर्ड',
    registeredBeekeeper: 'पंजीकृत मधुमक्खी पालक',
    kvicRegistration: 'KVIC पंजीकरण',
    cooperative: 'सहकारी समिति',
    assignedCluster: 'आवंटित क्लस्टर',
    logHarvestBtn: 'शहद निष्कर्षण दर्ज करें',
    selectHive: 'छत्ता चुनें',
    switchLanguage: 'भाषा',
    
    // Priority 1: Hive Health
    hiveHealthTitle: 'छत्ते का स्वास्थ्य',
    hiveHealthSubtitle: 'आपकी मधुमक्खी कॉलोनी की वर्तमान स्थिति और स्वास्थ्य',
    overallHealthLabel: 'समग्र स्वास्थ्य',
    healthGood: 'अच्छी स्थिति',
    healthWarning: 'ध्यान देने की आवश्यकता',
    healthCritical: 'तुरंत देखभाल की आवश्यकता',
    diseaseRiskLabel: 'बीमारी का खतरा',
    possibleDiseaseRiskTitle: 'संभावित बीमारी का खतरा',
    riskLow: 'कम (सुरक्षित)',
    riskMedium: 'मध्यम',
    riskHigh: 'अधिक खतरा',
    whatToDoTitle: 'क्या करें',
    whatToDoCheckActivity: 'छत्ते और मधुमक्खियों की गतिविधि की जांच करें।',
    whatToDoCheckSigns: 'मधुमक्खियों के असामान्य व्यवहार या दृश्य संकेतों को देखें।',
    whatToDoObserve: 'प्रभावित छत्ते को निरंतर निगरानी में रखें।',
    whatToDoContactExpert: 'उपचार से पहले पुष्टि के लिए स्थानीय मधुमक्खी पालन विशेषज्ञ या पशु चिकित्सक से संपर्क करें।',
    colonyStatusLabel: 'कॉलोनी और रानी मक्खी की स्थिति',
    colonyNormal: 'रानी मक्खी सक्रिय है, कॉलोनी सामान्य रूप से काम कर रही है',
    colonySwarmWarning: 'मधुमक्खियां नया छत्ता बना सकती हैं — रानी कप की जांच करें',
    colonyQueenLossWarning: 'रानी मक्खी की गतिविधि कम है — ब्रूड फ्रेम की जांच करें',
    beekeeperTipTitle: 'देखभाल के लिए सुझाव',
    defaultTip: 'कॉलोनी सक्रिय है। छत्ते के पास साफ पानी रखें और पर्याप्त हवादार स्थान बनाए रखें।',
    tipWarm: 'छत्ते का तापमान बढ़ गया है। दोपहर की तेज धूप में छत्ते की छत पर छाया करें।',
    tipWeightDrop: 'छत्ते का वजन काफी कम हुआ है। भोजन की उपलब्धता और छत्ते की स्थिति जांचें।',
    tipHealthy: 'छत्ता पूरी तरह स्वस्थ है। प्रवेश द्वार पर मधुमक्खियों की अच्छी हलचल है।',
    
    // Priority 2: Notifications & Alerts
    alertsTitle: 'छत्ते की सूचनाएं और चेतावनियाँ',
    alertsSubtitle: 'आपके छत्तों के बारे में महत्वपूर्ण चेतावनियाँ और संदेश',
    activeAlertsBadge: 'सक्रिय चेतावनियाँ',
    noAlertsMessage: 'आपके सभी छत्ते सुरक्षित और स्वस्थ हैं। कोई सक्रिय चेतावनी नहीं है।',
    filterAll: 'सभी सूचनाएं',
    filterNew: 'नई चेतावनियाँ',
    filterResolved: 'समाधान हुआ',
    statusNew: 'नई',
    statusResolved: 'समाधान हुआ',
    markResolvedBtn: 'समाधान हो गया',
    resolvedSuccessMsg: 'चेतावनी का समाधान दर्ज कर लिया गया है।',
    alertHighTempTitle: 'छत्ते का तापमान सामान्य से अधिक है',
    alertLowTempTitle: 'छत्ते का तापमान सामान्य से कम है',
    alertHumidityTitle: 'छत्ते की नमी सुरक्षित सीमा से बाहर है',
    alertWeightDropTitle: 'छत्ते के वजन में अचानक बदलाव देखा गया',
    alertDiseaseRiskTitle: 'संभावित बीमारी या कॉलोनी का खतरा देखा गया',
    alertSensorOfflineTitle: 'छत्ता सेंसर ऑफ़लाइन है',
    alertUnusualTitle: 'इस छत्ते में कुछ असामान्य देखा गया है',
    hiveLabel: 'छत्ता',
    recommendedLabel: 'सुझाव',
    recommendedTempAction: 'छत्ते की जांच करें और तापमान की निगरानी करें।',
    recommendedWeightAction: 'शहद/छत्ते के अचानक नुकसान या व्यवधान के लिए छत्ते की जांच करें।',
    recommendedSwarmAction: 'रानी कप की जांच करें और झुंड पकड़ने वाले बॉक्स की तैयारी करें।',
    testScenariosLabel: 'सेंसर चेतावनी परीक्षण (डेमो):',
    testHeatwave: 'उच्च तापमान चेतावनी भेजें',
    testWeightDrop: 'वजन गिरावट चेतावनी भेजें',
    testSwarm: 'झुंड बनने की चेतावनी भेजें',
    
    // Priority 3: Expected Honey & Yield Forecaster
    expectedHoneyTitle: 'अनुमानित शहद (उपज का पूर्वानुमान)',
    expectedHoneySubtitle: 'चुने गए छत्ते के लिए शहद उत्पादन और कटाई की तैयारी का AI पूर्वानुमान',
    estimatedHarvestLabel: 'अनुमानित शहद उत्पादन',
    expectedReadyLabel: 'अनुमानित तैयार समय',
    expectedHarvestWindowLabel: 'अनुमानित कटाई की अवधि',
    forecastConfidenceLabel: 'पूर्वानुमान का भरोसा',
    currentHiveWeightLabel: 'छत्ते का वर्तमान वजन',
    weightTrendLabel: 'वजन का रुझान',
    hiveHealthLabel: 'छत्ते का स्वास्थ्य',
    whyForecastTitle: 'यह अनुमान क्यों?',
    whyForecastSubtitle: 'यह अनुमान हाल ही में छत्ते के वजन में वृद्धि, मधुमक्खी गतिविधि, तापमान, आर्द्रता और पिछले उत्पादन पैटर्न पर आधारित है।',
    demoAiForecastBadge: 'डेमो / सिम्युलेटेड AI पूर्वानुमान',
    harvestDisclaimer: 'यह केवल एक अनुमानित पूर्वानुमान है, गारंटी नहीं। शहद निकालने से पहले सुनिश्चित करें कि छत्ते कम से कम 80% सीलबंद हों।',
    normalSeasonalRangeLabel: 'सामान्य मौसमी सीमा',
    confidenceLabel: 'अनुमान विश्वसनीयता',
    outlookGood: 'फूलों से अच्छा मकरंद मिल रहा है और मौसम अनुकूल है।',
    outlookGrowing: 'कॉलोनी अभी मजबूत हो रही है और छत्ते का विकास जारी है।',
    harvestTip: 'केवल पूरी तरह से सीलबंद छत्तों से ही शहद निकालें ताकि नमी 20% से कम रहे।',
    
    // Priority 4: Hive Sensor Data
    sensorDataTitle: 'छत्ते का सेंसर डेटा',
    sensorDataSubtitle: 'छत्ते के अंदर लगे स्मार्ट सेंसर से ताजा आंकड़े',
    sensorOnlineBadge: 'सेंसर चालू है',
    sensorOfflineBadge: 'सेंसर बंद है',
    noSensorConnectedBadge: 'कोई सेंसर नहीं जुड़ा',
    registerNewHiveBtn: '+ नया छत्ता जोड़ें',
    temperatureLabel: 'छत्ते का तापमान',
    temperatureNote: 'अनुकूल: 32°C – 36°C',
    humidityLabel: 'छत्ते की नमी',
    humidityNote: 'अनुकूल: 55% – 70%',
    weightLabel: 'छत्ते का वजन',
    weightNote: 'छत्ते और शहद का कुल वजन',
    soundLabel: 'मधुमक्खी गतिविधि (ध्वनि)',
    soundNote: 'सामान्य गुनगुनाहट आवृत्ति',
    statusComfortable: 'सामान्य',
    statusTooHigh: 'सामान्य से अधिक',
    statusTooLow: 'सामान्य से कम',
    statusSteady: 'स्थिर',
    statusCalm: 'शांत और सक्रिय',
    statusAgitated: 'अशांत',
    lastUpdatedLabel: 'अंतिम अपडेट',
    
    // Priority 5: Recent Activity & Harvested Batches
    recentActivityTitle: 'हाल की गतिविधियाँ और निकाले गए बैच',
    recentActivitySubtitle: 'बीप्रूफ नेटवर्क पर दर्ज किए गए आपके शहद के बैच',
    batchesHarvestedCard: 'निकाले गए बैच',
    assignedHivesCard: 'आवंटित छत्ते',
    predominantFloraCard: 'प्रमुख वनस्पति',
    noBatchesMessage: 'अभी तक कोई शहद बैच दर्ज नहीं किया गया है।',
    noBatchesForHive: 'इस छत्ते के लिए अभी तक कोई शहद बैच दर्ज नहीं किया गया है।',
    logFirstBatchLink: 'अपना पहला शहद बैच अभी दर्ज करें',
    thBatchId: 'बैच संख्या',
    thFlora: 'फूलों का स्रोत',
    thHarvestDate: 'कटाई की तारीख',
    thQuantity: 'मात्रा',
    thStatus: 'स्थिति',
    thVerificationQr: 'सत्यापन क्यूआर',
    viewTokenLink: 'टोकन देखें',
    
    // Assigned Hives Details
    hivesListTitle: 'मेरे आवंटित छत्ते',
    thHiveCode: 'छत्ता कोड',
    thBeeSpecies: 'मधुमक्खी प्रजाति',
    thInstallDate: 'स्थापना तिथि',
    thLocation: 'जीपीएस स्थान',
    thNotes: 'टिप्पणी',
    thColonyStatus: 'स्थिति',
    
    // Modal: Log Harvest
    modalTitle: 'शहद निष्कर्षण दर्ज करें',
    modalSuccessTitle: 'शहद बैच सफलतापूर्वक दर्ज हो गया!',
    modalSuccessSubtitle: 'आपका शहद बैच अब ब्लॉकचेन पर सुरक्षित रूप से दर्ज हो चुका है।',
    blockchainProofLabel: 'ब्लॉकचेन लेनदेन प्रमाण',
    labelSelectHive: 'छत्ता चुनें',
    selectHiveHint: 'केवल आपके नाम पर पंजीकृत छत्तों को ही चुना जा सकता है।',
    labelQuantityKg: 'शहद की मात्रा (किग्रा)',
    labelHarvestDate: 'कटाई की तारीख',
    labelFloralSource: 'फूलों का स्रोत',
    labelFieldNotes: 'अतिरिक्त विवरण',
    fieldNotesPlaceholder: 'उदा. शुद्ध प्राकृतिक शहद, 40°C से नीचे कोल्ड-फिल्टर किया गया',
    btnCancel: 'रद्द करें',
    btnRecordHarvest: 'बैच दर्ज करें',
    btnDone: 'पूरा हुआ',
    submittingHarvest: 'ब्लॉकचेन पर दर्ज हो रहा है...',

    // Demo Video & Tutorial
    demoVideoBtn: 'डेमो वीडियो गाइड',
    demoVideoModalTitle: 'मधुमक्खी पालक पोर्टल ट्यूटोरियल व डेमो वीडियो',
    demoVideoModalSubtitle: 'मधुमक्खी पालन क्षेत्र में स्मार्टफोन से छत्ते की जांच, सेंसर टेलीमेट्री देखने और शहद बैच दर्ज करने का वीडियो ट्यूटोरियल।',
    demoVideoBadge: 'वीडियो ट्यूटोरियल',
    demoVideoOpenNewTab: 'नई टैब में खोलें',
    demoVideoClose: 'बंद करें',
    demoVideoTutorialGuide: 'इस ट्यूटोरियल में मुख्य बिंदु',
    demoVideoPoint1: 'स्मार्टफोन से छत्ते के पास रीयल-टाइम डेटा देखना',
    demoVideoPoint2: 'तापमान, आर्द्रता, वजन और मधुमक्खी गतिविधि की स्थिति जांचना',
    demoVideoPoint3: 'नया छत्ता जोड़ना और डिजिटल सत्यापन क्यूआर टोकन बनाना'
  }
};
