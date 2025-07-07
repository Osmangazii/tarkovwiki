import React from "react";

// Backend runs on port 5000, frontend runs on port 3001
const API_URL = process.env.REACT_APP_API_URL || "https://tarkovwiki.onrender.com/api/auth";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [showAuthForm, setShowAuthForm] = React.useState(false);
  const [isRegister, setIsRegister] = React.useState(false);
  const [loginData, setLoginData] = React.useState({ username: "", password: "" });
  const [registerData, setRegisterData] = React.useState({ email: "", username: "", password: "" });
  const [authError, setAuthError] = React.useState("");

  // Sayfa yüklendiğinde giriş durumunu kontrol et
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setShowAuthForm(true);
    setIsRegister(false);
    setAuthError("");
  };

  const handleLogout = () => {
    console.log('Logging out, removing token');
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.reload();
  };

  const handleAuthFormClose = () => {
    setShowAuthForm(false);
    setLoginData({ username: "", password: "" });
    setRegisterData({ email: "", username: "", password: "" });
    setAuthError("");
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      console.log('Sending login request with data:', loginData);
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(loginData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Giriş başarısız");
      }
      
      const data = await res.json();
      console.log('Login response:', data);
      
      if (data.token) {
        // Ensure token is properly formatted
        const token = data.token.trim();
        if (!token) {
          throw new Error('Invalid token received');
        }
        console.log('Storing token:', token);
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        setShowAuthForm(false);
        window.location.reload();
      } else {
        console.error('No token received in login response');
        throw new Error('No authentication token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      setAuthError(err.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      console.log('Sending register request with data:', registerData);
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(registerData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Kayıt başarısız");
      }
      
      const data = await res.json();
      console.log('Register response:', data);
      setIsLoggedIn(true);
      setShowAuthForm(false);
    } catch (err) {
      console.error('Register error:', err);
      setAuthError(err.message);
    }
  };

  const buttonStyle = {
    marginRight: 8,
    background: "linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 20,
    padding: "8px 20px",
    fontWeight: 600,
    fontSize: 15,
    boxShadow: "0 2px 8px rgba(123,47,242,0.12)",
    cursor: "pointer",
    transition: "background 0.2s"
  };

  const iconButtonStyle = {
    ...buttonStyle,
    padding: "8px",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px"
  };

  return (
    <div className="tq-header" style={{ position: "relative" }}>
      <h1 className="tq-title">Tarkov Tiki</h1>
      <div className="tq-search">
        {isLoggedIn ? (
          <button
            className="logout-btn"
            onClick={handleLogout}
            style={buttonStyle}
          >
            Çıkış Yap
          </button>
        ) : (
          <button
            className="login-btn"
            onClick={handleLogin}
            style={buttonStyle}
          >
            Giriş Yap
          </button>
        )}
      </div>
      {showAuthForm && (
        <div style={{
          position: "absolute",
          top: "100%",
          right: 0,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 0,
          zIndex: 1000,
          minWidth: 340,
          maxWidth: 340,
          width: 340,
          boxShadow: "0 2px 16px rgba(0,0,0,0.13)",
          marginTop: 8,
          transition: "width 0.2s",
          overflow: "visible"
        }}>
          <button
            onClick={handleAuthFormClose}
            style={{
              position: "absolute",
              top: 10,
              right: 12,
              background: "none",
              border: "none",
              fontSize: 22,
              color: "#888",
              cursor: "pointer",
              zIndex: 2
            }}
            aria-label="Kapat"
          >
            ×
          </button>
          <div style={{ display: "flex", borderBottom: "1px solid #eee", marginBottom: 18 }}>
            <button
              type="button"
              onClick={() => { setIsRegister(false); setAuthError(""); }}
              style={{
                flex: 1,
                padding: "14px 0 10px 0",
                background: !isRegister ? "#f0e6ff" : "#fff",
                color: !isRegister ? "#7b2ff2" : "#888",
                border: "none",
                borderBottom: !isRegister ? "2.5px solid #7b2ff2" : "2.5px solid transparent",
                fontWeight: !isRegister ? 700 : 500,
                fontSize: 16,
                borderTopLeftRadius: 12,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setAuthError(""); }}
              style={{
                flex: 1,
                padding: "14px 0 10px 0",
                background: isRegister ? "#f0e6ff" : "#fff",
                color: isRegister ? "#7b2ff2" : "#888",
                border: "none",
                borderBottom: isRegister ? "2.5px solid #7b2ff2" : "2.5px solid transparent",
                fontWeight: isRegister ? 700 : 500,
                fontSize: 16,
                borderTopRightRadius: 12,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Kayıt Ol
            </button>
          </div>
          <div style={{ padding: 24, paddingTop: 0 }}>
            {authError && (
              <div style={{ color: "#d32f2f", background: "#fff0f0", border: "1px solid #ffd6d6", borderRadius: 6, padding: 10, marginBottom: 14, textAlign: "center", fontWeight: 500 }}>
                {authError}
              </div>
            )}
            {isRegister ? (
              <form onSubmit={handleRegisterSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    style={{ width: "100%", padding: 10, marginBottom: 10, borderRadius: 6, border: "1px solid #ccc", fontSize: 15 }}
                  />
                  <input
                    type="text"
                    name="username"
                    placeholder="Kullanıcı Adı"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                    required
                    style={{ width: "100%", padding: 10, marginBottom: 10, borderRadius: 6, border: "1px solid #ccc", fontSize: 15 }}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Şifre"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", fontSize: 15 }}
                  />
                </div>
                <button type="submit" style={{ width: "100%", background: "linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 700, fontSize: 16, cursor: "pointer", marginBottom: 4, boxShadow: "0 1px 4px rgba(123,47,242,0.08)" }}>Kayıt Ol</button>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <input
                    type="text"
                    name="username"
                    placeholder="Kullanıcı Adı"
                    value={loginData.username}
                    onChange={handleLoginChange}
                    required
                    style={{ width: "100%", padding: 10, marginBottom: 10, borderRadius: 6, border: "1px solid #ccc", fontSize: 15 }}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Şifre"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", fontSize: 15 }}
                  />
                </div>
                <button type="submit" style={{ width: "100%", background: "linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 700, fontSize: 16, cursor: "pointer", marginBottom: 4, boxShadow: "0 1px 4px rgba(123,47,242,0.08)" }}>Giriş Yap</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header; 