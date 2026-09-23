import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getProfileByUserId, saveProfile } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    };

    loadSession();
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let active = true;
    if (!session?.user) {
      setProfile(null);
      return () => { active = false; };
    }

    getProfileByUserId(session.user.id).then(async ({ profile: savedProfile }) => {
      if (!active) return;
      if (savedProfile) {
        setProfile(savedProfile);
        return;
      }

      const metadata = session.user.user_metadata || {};
      const { profile: createdProfile } = await saveProfile(session.user.id, {
        name: metadata.name || session.user.email?.split('@')[0] || 'New professional',
        display_name: metadata.name || session.user.email?.split('@')[0] || 'New professional',
        category: metadata.category || 'Professional',
        slug: `${(metadata.name || session.user.email?.split('@')[0] || 'professional')
          .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${session.user.id.slice(0, 6)}`,
        status: 'ACTIVE',
        services: [],
      });
      if (active) setProfile(createdProfile);
    }).catch(() => {
      if (active) setProfile(session.user.user_metadata || null);
    });

    return () => { active = false; };
  }, [session]);

  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ session, user: session?.user || null, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider.');
  return value;
}
