import Photobooth from "./components/Photobooth";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="flex flex-1 justify-center items-center">
        <Photobooth />
      </div>
      <Footer />
    </div>
  );
}
