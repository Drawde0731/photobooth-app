import PrivacyModal from "./PrivacyModal";

const Footer = () => {
  return (
    <div className="flex flex-col text-white">
      <footer className="border-t border-gray-700">
        <div className="max-w-(--breakpoint-xl) mx-auto">

          <div className="py-8 flex flex-col items-center gap-2 text-center">
            <div className="flex gap-4 text-sm">
              <PrivacyModal />
            </div>

            <span className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()}{" "}
              <span className="font-semibold text-white">Snap & Pose</span>. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
