import UserDataSection from "./UserDataSection";
import PrivacySecuritySection from "./PrivacySecuritySection";

function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <UserDataSection />
      <PrivacySecuritySection />
    </div>
  );
}

export default SettingsPage;
