import Button from "./button";

const LogoutButton: React.FC<{ english?: boolean }> = ({ english = false }) => (
  <Button
    color="red"
    onClick={() => {
      try {
        localStorage.removeItem("token");
        location.pathname = "/" + (english ? "en" : "ar");
      } catch {}
    }}
  >
    {english ? "Logout" : "تسجيل خروج"}
  </Button>
);

export default LogoutButton;
