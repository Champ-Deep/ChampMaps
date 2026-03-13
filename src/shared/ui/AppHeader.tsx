import InstallPrompt from "@/features/install/ui/InstallPrompt";

export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="brand-row">
        <div className="brand-copy">
          <p className="app-kicker">ChampMaps: Champion Your Maps</p>
          <h1>ChampMaps</h1>
          <p className="app-copy">
            Build high-detail map posters from OpenStreetMap data with curated
            palettes, custom typography, and print-ready PNG & PDF output.
          </p>
        </div>
        <img
          className="brand-logo"
          src="/assets/logo.png"
          alt="ChampMaps logo"
        />
      </div>
      <InstallPrompt />
    </header>
  );
}
