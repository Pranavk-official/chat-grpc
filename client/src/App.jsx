import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-2xl font-bold text-indigo-600">
                    ChatApp
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => setIsLoggedIn(false)}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Switch>
            <Route path="/chat">
              {isLoggedIn ? <Chat /> : <Login setIsLoggedIn={setIsLoggedIn} />}
            </Route>
            <Route path="/login">
              <Login setIsLoggedIn={setIsLoggedIn} />
            </Route>
            <Route path="/register">
              <Register setIsLoggedIn={setIsLoggedIn} />
            </Route>
            <Route path="/" exact>
              {isLoggedIn ? <Chat /> : <Login setIsLoggedIn={setIsLoggedIn} />}
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default App;
