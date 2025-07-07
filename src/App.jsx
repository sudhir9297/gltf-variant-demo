import "./App.css";
import Viewer from "./component/viewer.jsx";
import Sidemenu from "./component/sidemenu.jsx";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center polka-bg">
      <div className="flex gap-10">
        {/* Gradient Card */}
        <div className="w-[648px] h-[648px] rounded-3xl shadow-lg overflow-hidden bg-white">
          <Viewer />
        </div>
        {/* Control Panel */}
        <Sidemenu />
      </div>
    </div>
  );
}

export default App;
