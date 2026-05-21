function ExchangeTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="poke-x-tabs" role="tablist" aria-label="Secciones del exchange">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`poke-x-tab ${activeTab === tab.id ? 'is-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="poke-x-tab__icon" aria-hidden="true">{tab.icon}</span>
          <span className="poke-x-tab__label">{tab.label}</span>
          {tab.badge ? <span className="poke-x-tab__badge">{tab.badge}</span> : null}
        </button>
      ))}
    </div>
  );
}

export default ExchangeTabs;
