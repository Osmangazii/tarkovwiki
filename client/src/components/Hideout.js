import React, { useState, useEffect } from 'react';

const gameVersions = [
  { id: 'standard', name: 'Standard Edition' },
  { id: 'eft', name: 'Edge of Darkness' },
  { id: 'pfe', name: 'Prepare for Escape' },
  { id: 'left_behind', name: 'Left Behind' },
  { id: 'unheard', name: 'The Unheard Edition' }
];

const hideoutModules = [
  { id: 'air_filtering', name: 'Air Filtering Unit', maxLevel: 1 },
  { id: 'bitcoin_farm', name: 'Bitcoin Farm', maxLevel: 3 },
  { id: 'booze_generator', name: 'Booze Generator', maxLevel: 1 },
  { id: 'cultist_circle', name: 'Cultist Circle', maxLevel: 1 },
  { id: 'defective_wall', name: 'Defective Wall', maxLevel: 6 },
  { id: 'gear_rack', name: 'Gear Rack', maxLevel: 3 },
  { id: 'generator', name: 'Generator', maxLevel: 3 },
  { id: 'heating', name: 'Heating', maxLevel: 3 },
  { id: 'gym', name: 'Gym', maxLevel: 1 },
  { id: 'hall_of_fame', name: 'Hall of Fame', maxLevel: 3 },
  { id: 'illumination', name: 'Illumination', maxLevel: 3 },
  { id: 'intelligence_center', name: 'Intelligence Center', maxLevel: 3 },
  { id: 'lavatory', name: 'Lavatory', maxLevel: 3 },
  { id: 'library', name: 'Library', maxLevel: 1 },
  { id: 'medstation', name: 'Medstation', maxLevel: 3 },
  { id: 'nutrition_unit', name: 'Nutrition Unit', maxLevel: 3 },
  { id: 'rest_space', name: 'Rest Space', maxLevel: 3 },
  { id: 'scav_case', name: 'Scav Case', maxLevel: 1 },
  { id: 'security', name: 'Security', maxLevel: 3 },
  { id: 'shooting_range', name: 'Shooting Range', maxLevel: 3 },
  { id: 'solar_power', name: 'Solar Power', maxLevel: 1 },
  { id: 'stash', name: 'Stash', maxLevel: 4 },
  { id: 'vents', name: 'Vents', maxLevel: 3 },
  { id: 'water_collector', name: 'Water Collector', maxLevel: 3 },
  { id: 'weapon_rack', name: 'Weapon Rack', maxLevel: 3 },
  { id: 'workbench', name: 'Workbench', maxLevel: 3 },
  { id: 'christmas_tree', name: 'Christmas Tree', maxLevel: 1 }
];

const LevelSelector = ({ currentLevel, maxLevel, onChange }) => {
  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      <div
        onClick={() => onChange(0)}
        style={{
          width: '30px',
          height: '30px',
          border: '2px solid #ddd',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backgroundColor: currentLevel >= 0 ? '#6200ea' : 'white',
          color: currentLevel >= 0 ? 'white' : '#666',
          transition: 'all 0.2s ease'
        }}
      >
        0
      </div>
      {[...Array(maxLevel)].map((_, index) => (
        <div
          key={index}
          onClick={() => onChange(index + 1)}
          style={{
            width: '30px',
            height: '30px',
            border: '2px solid #ddd',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backgroundColor: currentLevel >= index + 1 ? '#6200ea' : 'white',
            color: currentLevel >= index + 1 ? 'white' : '#666',
            transition: 'all 0.2s ease'
          }}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

const Hideout = () => {
  const [currentLevels, setCurrentLevels] = useState({});
  const [targetLevels, setTargetLevels] = useState({});
  const [selectedModule, setSelectedModule] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gameVersion, setGameVersion] = useState('standard');
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    // Kullanıcıya özel hideout ilerlemesini backend'den çek
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/hideout/progress', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // data: { bitcoin_farm: { current_level: 2, target_level: 3 }, ... }
        const curr = {};
        const targ = {};
        Object.entries(data).forEach(([moduleId, levels]) => {
          curr[moduleId] = levels.current_level;
          targ[moduleId] = levels.target_level;
        });
        setCurrentLevels(curr);
        setTargetLevels(targ);
        setIsDirty(false);
        setSaveStatus('');
      });
    // Oyun versiyonu localStorage'dan alınabilir (isteğe bağlı)
    const savedGameVersion = localStorage.getItem('gameVersion');
    if (savedGameVersion) {
      setGameVersion(savedGameVersion);
    }
  }, []);

  const handleGameVersionChange = (version) => {
    setGameVersion(version);
    localStorage.setItem('gameVersion', version);
  };

  const handleCurrentLevelChange = (moduleId, level) => {
    setCurrentLevels(prev => ({ ...prev, [moduleId]: level }));
    setIsDirty(true);
  };

  const handleTargetLevelChange = (moduleId, level) => {
    setTargetLevels(prev => ({ ...prev, [moduleId]: level }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setSaveStatus('Saving...');
    const allModuleIds = Array.from(new Set([
      ...Object.keys(currentLevels),
      ...Object.keys(targetLevels)
    ]));
    try {
      await Promise.all(
        allModuleIds.map(moduleId =>
          fetch('/api/hideout/progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              moduleId,
              current_level: currentLevels[moduleId] || 0,
              target_level: targetLevels[moduleId] || 0
            })
          })
        )
      );
      setIsDirty(false);
      setSaveStatus('Saved!');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (e) {
      setSaveStatus('Save failed!');
    }
  };

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
  };

  const filteredModules = hideoutModules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
      <div>
        <div style={{ marginBottom: '15px' }}>
          <select
            value={gameVersion}
            onChange={(e) => handleGameVersionChange(e.target.value)}
            style={{
              width: '200px',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              marginBottom: '10px',
              backgroundColor: 'white',
              fontSize: '14px'
            }}
          >
            {gameVersions.map(version => (
              <option key={version.id} value={version.id}>
                {version.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          {filteredModules.map((module) => (
            <div
              key={module.id}
              onClick={() => handleModuleSelect(module)}
              style={{
                padding: '15px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                backgroundColor: selectedModule?.id === module.id ? '#f0e6ff' : 'white'
              }}
            >
              <h3 style={{ margin: 0, fontSize: '16px' }}>{module.name}</h3>
              <div style={{ 
                fontSize: '14px', 
                color: '#666', 
                marginTop: '5px',
                display: 'flex',
                gap: '10px'
              }}>
                <span>Current: {currentLevels[module.id] || 0}</span>
                <span>Target: {targetLevels[module.id] || 0}</span>
                <span>Max: {module.maxLevel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedModule && (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
          <h2 style={{ margin: '0 0 20px 0' }}>{selectedModule.name}</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px' }}>Current Level</h3>
            <LevelSelector
              currentLevel={currentLevels[selectedModule.id] || 0}
              maxLevel={selectedModule.maxLevel}
              onChange={(level) => handleCurrentLevelChange(selectedModule.id, level)}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '10px' }}>Target Level</h3>
            <LevelSelector
              currentLevel={targetLevels[selectedModule.id] || 0}
              maxLevel={selectedModule.maxLevel}
              onChange={(level) => handleTargetLevelChange(selectedModule.id, level)}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!isDirty}
            style={{
              background: isDirty ? 'linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)' : '#eee',
              color: isDirty ? '#fff' : '#888',
              border: 'none',
              borderRadius: 8,
              padding: '10px 24px',
              fontWeight: 700,
              fontSize: 16,
              cursor: isDirty ? 'pointer' : 'not-allowed',
              marginBottom: 16,
              marginTop: 8
            }}
          >
            {saveStatus === 'Saving...' ? 'Saving...' : saveStatus === 'Saved!' ? 'Saved!' : 'Save'}
          </button>

          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Progress</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '8px', backgroundColor: '#ddd', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${((currentLevels[selectedModule.id] || 0) / selectedModule.maxLevel) * 100}%`,
                    height: '100%',
                    backgroundColor: '#6200ea',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
              <span style={{ fontSize: '14px', color: '#666' }}>
                {currentLevels[selectedModule.id] || 0} / {selectedModule.maxLevel}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hideout; 