import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import AdminLogin from "./AdminLogin";
import AdminArticles from "./AdminArticles";
import AdminEnquiries from "./AdminEnquiries";
import ArticleEditor from "./ArticleEditor";

const STORAGE_KEY = "irn_admin_secret";

export default function AdminApp() {
  const [secret, setSecret] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!secret) {
      navigate("/admin");
    }
  }, [secret, navigate]);

  function handleLogin(s: string) {
    try {
      sessionStorage.setItem(STORAGE_KEY, s);
    } catch {
    }
    setSecret(s);
  }

  function handleLogout() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
    }
    setSecret(null);
    navigate("/admin");
  }

  if (!secret) {
    return (
      <>
        <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
        <AdminLogin onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
      <Switch>
      <Route path="/admin/articles/new">
        <ArticleEditor secret={secret} />
      </Route>
      <Route path="/admin/articles/:id/edit">
        {(params) => <ArticleEditor secret={secret} articleId={Number(params.id)} />}
      </Route>
      <Route path="/admin/enquiries">
        <AdminEnquiries secret={secret} onLogout={handleLogout} />
      </Route>
      <Route path="/admin/articles">
        <AdminArticles secret={secret} onLogout={handleLogout} />
      </Route>
      <Route path="/admin">
        <AdminArticles secret={secret} onLogout={handleLogout} />
      </Route>
    </Switch>
    </>
  );
}
