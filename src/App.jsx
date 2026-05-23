import { useState, useEffect, useRef } from "react";

const SECTIONS = {
  rest:  { label: "Rest & Return",   icon: "◑", accent: "#4a9eff" },
  focus: { label: "Focus & Clarity", icon: "◈", accent: "#60c4ff" },
  heart: { label: "Heart & Healing", icon: "♡", accent: "#7dd4fc" },
};

const allTracks = [
  { id: "t1",  title: "Back to Sleep",   subtitle: "The Quiet Return",  duration: "9:36", hz: "528 Hz", sections: ["rest"],          desc: "Ease into stillness" },
  { id: "t2",  title: "Relaxation",      subtitle: "The Long Exhale",   duration: "9:24", hz: "528 Hz", sections: ["rest"],          desc: "Release and soften" },
  { id: "t3",  title: "Inner Balance",   subtitle: "The Quiet Inside",  duration: "5:19", hz: "432 Hz", sections: ["rest","heart"],  desc: "Find your center" },
  { id: "t4",  title: "Grounded",        subtitle: "Emotional Balance", duration: "8:10", hz: "432 Hz", sections: ["rest","heart"],  desc: "Root and restore" },
  { id: "t5",  title: "Deep Focus",      subtitle: "Mental Absorption", duration: "8:29", hz: "40 Hz",  sections: ["focus"],         desc: "Enter the flow state" },
  { id: "t6",  title: "Creative Focus",  subtitle: "Clarity Boost",     duration: "8:20", hz: "40 Hz",  sections: ["focus"],         desc: "Sharpen and create" },
  { id: "t7",  title: "Now",             subtitle: "Quiet Presence",    duration: "3:41", hz: "432 Hz", sections: ["focus","rest"],  desc: "Just this moment" },
  { id: "t8",  title: "Joy",             subtitle: "Bloom",             duration: "7:13", hz: "639 Hz", sections: ["heart"],         desc: "Light rising through you" },
  { id: "t9",  title: "For Love",        subtitle: "Where Love Lives",  duration: "7:25", hz: "639 Hz", sections: ["heart","rest"],  desc: "Open the heart fully" },
  { id: "t10", title: "After the Storm", subtitle: "Return to Center",  duration: "9:07", hz: "432 Hz", sections: ["heart","rest"],  desc: "Gentle return to peace" },
];

const meditationSections = {
  rest:  { label: "Rest & Return",   tagline: "Let the body remember how to rest", accent: "#4a9eff", icon: "◑", trackIds: ["t1","t2","t3","t4","t7","t9","t10"], meditation: { id: "m1", title: "Fall Asleep", duration: "18:00" } },
  focus: { label: "Focus & Clarity", tagline: "A clear mind is a powerful mind",   accent: "#60c4ff", icon: "◈", trackIds: ["t5","t6","t7"],                        meditation: { id: "m2", title: "Clear Mind",  duration: "15:00" } },
  heart: { label: "Heart & Healing", tagline: "Return to the warmth within",        accent: "#7dd4fc", icon: "♡", trackIds: ["t3","t4","t8","t9","t10"],             meditation: { id: "m3", title: "Heal",        duration: "20:00", comingSoon: true } },
};

function SectionTags({ sections }) {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 5 }}>
      {sections.map(s => (
        <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 3, background: `${SECTIONS[s].accent}15`, border: `1px solid ${SECTIONS[s].accent}30`, color: SECTIONS[s].accent, fontSize: 9, padding: "2px 7px", borderRadius: 10, letterSpacing: 0.5 }}>
          {SECTIONS[s].icon} {SECTIONS[s].label}
        </span>
      ))}
    </div>
  );
}

function WaveVisualizer({ color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 18 }}>
      {[0,1,2,3,4].map(i => (
        <div key={i} style={{ width: 3, borderRadius: 2, background: color || "#4a9eff", height: "100%", animation: `wave 1.2s ease-in-out infinite`, animationDelay: `${i*0.15}s` }} />
      ))}
    </div>
  );
}

function TrackRow({ track, isPlaying, onPlay, showAdd, onAdd, inPlaylist }) {
  const primaryAccent = SECTIONS[track.sections[0]].accent;
  return (
    <div onClick={() => onPlay(track)}
      style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: isPlaying ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.02)", border: `1px solid ${isPlaying ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)"}`, borderRadius: 14, marginBottom: 8, cursor: "pointer", transition: "all 0.2s" }}
      onMouseEnter={e => { if (!isPlaying) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
      onMouseLeave={e => { if (!isPlaying) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
    >
      <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, marginTop: 2, background: isPlaying ? primaryAccent : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
        {isPlaying ? <WaveVisualizer color="#050f23" /> : <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>▶</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, color: "#fff", marginBottom: 2 }}>{track.title}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>{track.subtitle} · <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.25)" }}>{track.desc}</em></div>
        <SectionTags sections={track.sections} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0, paddingTop: 2 }}>
        <span style={{ color: primaryAccent, fontSize: 10, letterSpacing: 1 }}>{track.hz}</span>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>{track.duration}</span>
        {showAdd && (
          <button onClick={e => { e.stopPropagation(); onAdd(track); }}
            style={{ background: inPlaylist ? "rgba(74,158,255,0.2)" : "rgba(255,255,255,0.06)", border: `1px solid ${inPlaylist ? "rgba(74,158,255,0.4)" : "rgba(255,255,255,0.1)"}`, color: inPlaylist ? "#4a9eff" : "rgba(255,255,255,0.4)", borderRadius: 8, padding: "3px 9px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'", transition: "all 0.2s", marginTop: 2 }}>
            {inPlaylist ? "✓" : "+"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AzaApp() {
  const [onboarded, setOnboarded] = useState(false);
  const [nav, setNav] = useState("home");
  const [activeSection, setActiveSection] = useState(null);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [freeUsed, setFreeUsed] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notified, setNotified] = useState(false);
  const [search, setSearch] = useState("");
  const [filterSection, setFilterSection] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [addingToPlaylist, setAddingToPlaylist] = useState(null);
  const [shuffled, setShuffled] = useState(null);
  const intervalRef = useRef(null);

  const section = activeSection ? meditationSections[activeSection] : null;

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => setProgress(p => p >= 100 ? 0 : p + 0.15), 500);
    } else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const handlePlay = (item) => {
    if (!subscribed && freeUsed) { setShowPaywall(true); return; }
    if (!subscribed && !freeUsed) setFreeUsed(true);
    if (playingTrack?.id === item.id) { setIsPlaying(p => !p); return; }
    setPlayingTrack(item); setIsPlaying(true); setProgress(0);
  };

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    const pl = { id: Date.now().toString(), name: newPlaylistName.trim(), tracks: [] };
    setPlaylists(p => [...p, pl]);
    setNewPlaylistName(""); setCreatingPlaylist(false); setActivePlaylist(pl.id);
  };

  const toggleTrackInPlaylist = (plId, track) => {
    setPlaylists(pls => pls.map(pl => {
      if (pl.id !== plId) return pl;
      const exists = pl.tracks.find(t => t.id === track.id);
      return { ...pl, tracks: exists ? pl.tracks.filter(t => t.id !== track.id) : [...pl.tracks, track] };
    }));
  };

  const isInAnyPlaylist = (trackId) => playlists.some(pl => pl.tracks.find(t => t.id === trackId));
  const isInPlaylist = (plId, trackId) => { const pl = playlists.find(p => p.id === plId); return pl ? !!pl.tracks.find(t => t.id === trackId) : false; };
  const currentPlaylist = playlists.find(p => p.id === activePlaylist);

  const filteredTracks = allTracks.filter(t => {
    const matchesSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.subtitle.toLowerCase().includes(search.toLowerCase()) || t.hz.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filterSection || t.sections.includes(filterSection);
    return matchesSearch && matchesFilter;
  });

  const shuffleArr = (arr) => { const a = [...arr]; for (let i = a.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const primaryAccent = playingTrack ? SECTIONS[playingTrack.sections[0]].accent : "#4a9eff";

  // ── ONBOARDING ──
  if (!onboarded) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #050f23 0%, #0a1f3d 60%, #061628 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:0.4;transform:scale(1)}50%{opacity:0.7;transform:scale(1.08)}}`}</style>
      <div style={{ textAlign: "center", padding: "0 32px", animation: "fadeUp 0.8s ease both" }}>
        <div style={{ width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #4a9eff44, #1a3a5c22, transparent)", border: "1px solid rgba(74,158,255,0.2)", animation: "pulse 4s ease-in-out infinite", boxShadow: "0 0 60px rgba(74,158,255,0.1)", margin: "0 auto 36px" }} />
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 16 }}>Welcome</div>
        <h1 style={{ fontSize: 72, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "#fff", lineHeight: 1, marginBottom: 20 }}>aza</h1>
        <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)", margin: "0 auto 24px" }} />
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, lineHeight: 1.8, fontWeight: 300, maxWidth: 280, margin: "0 auto 48px" }}>Sound and guidance for rest, clarity, and the return to yourself.</p>
        <button onClick={() => setOnboarded(true)} style={{ background: "linear-gradient(135deg, #4a9eff, #60c4ff)", border: "none", borderRadius: 30, padding: "14px 48px", color: "#050f23", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans'", letterSpacing: "0.08em", boxShadow: "0 8px 32px rgba(74,158,255,0.25)", transition: "all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >Begin</button>
        <div style={{ marginTop: 20, fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: 1 }}>7 days free · no card required</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #050f23 0%, #0a1f3d 50%, #061628 100%)", color: "#fff", fontFamily: "'DM Sans', sans-serif", paddingBottom: playingTrack ? "148px" : "0" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} ::-webkit-scrollbar{width:0;} @keyframes wave{0%,100%{transform:scaleY(0.3)}50%{transform:scaleY(1)}} @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:0.4;transform:scale(1)}50%{opacity:0.7;transform:scale(1.05)}} input::placeholder{color:rgba(255,255,255,0.2)} input:focus{outline:none;border-color:rgba(74,158,255,0.4)!important}`}</style>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 24px" }}>
        {/* HEADER */}
        <div style={{ paddingTop: 48, paddingBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: 26, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: 4 }}>aza</h1>
          <button onClick={() => setShowPaywall(true)} style={{ background: subscribed ? "rgba(74,158,255,0.12)" : "none", border: `1px solid ${subscribed ? "rgba(74,158,255,0.3)" : "rgba(255,255,255,0.12)"}`, color: subscribed ? "#4a9eff" : "rgba(255,255,255,0.4)", borderRadius: 20, padding: "6px 16px", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans'", transition: "all 0.2s" }}>
            {subscribed ? "✓ Member" : "Unlock access"}
          </button>
        </div>

        {/* NAV */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 32, overflowX: "auto" }}>
          {[{id:"home",label:"Home"},{id:"meditate",label:"Meditate"},{id:"music",label:"Music"},{id:"playlists",label:"My Playlists"}].map(t => (
            <button key={t.id} onClick={() => { setNav(t.id); setActiveSection(null); }}
              style={{ background: "none", border: "none", borderBottom: `2px solid ${nav===t.id ? "#4a9eff" : "transparent"}`, color: nav===t.id ? "#fff" : "rgba(255,255,255,0.3)", padding: "12px 14px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'", letterSpacing: "0.05em", marginBottom: -1, transition: "all 0.2s", whiteSpace: "nowrap" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ HOME ══ */}
        {nav === "home" && (
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            <div style={{ textAlign: "center", paddingBottom: 40 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
                <div style={{ width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #4a9eff44, #1a3a5c22, transparent)", border: "1px solid rgba(74,158,255,0.2)", animation: "pulse 4s ease-in-out infinite", boxShadow: "0 0 60px rgba(74,158,255,0.1)" }} />
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.7, fontWeight: 300 }}>Sound and guidance for rest, clarity,<br />and the return to yourself.</p>
            </div>
            {Object.entries(meditationSections).map(([key, s]) => (
              <div key={key} onClick={() => { setNav("meditate"); setActiveSection(key); }}
                style={{ marginBottom: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 22, cursor: "pointer", transition: "all 0.25s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                      <span style={{ color: s.accent, fontSize: 16 }}>{s.icon}</span>
                      <span style={{ fontSize: 16, fontFamily: "'Cormorant Garamond', serif" }}>{s.label}</span>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{s.tagline}</p>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 20 }}>›</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <span style={{ background: `${s.accent}18`, color: s.accent, fontSize: 10, padding: "3px 10px", borderRadius: 20 }}>1 meditation</span>
                  <span style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)", fontSize: 10, padding: "3px 10px", borderRadius: 20 }}>{s.trackIds.length} tracks</span>
                </div>
              </div>
            ))}
            <div style={{ textAlign: "center", padding: "24px 0 32px" }}>
              <button onClick={() => setShowPaywall(true)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)", borderRadius: 30, padding: "10px 24px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
              >Unlock full access</button>
            </div>
          </div>
        )}

        {/* ══ MEDITATE ══ */}
        {nav === "meditate" && !activeSection && (
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            <h2 style={{ fontSize: 26, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, marginBottom: 6 }}>Meditate</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 24 }}>Choose your path inward</p>
            {Object.entries(meditationSections).map(([key, s]) => (
              <div key={key} onClick={() => setActiveSection(key)}
                style={{ marginBottom: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 22, cursor: "pointer", transition: "all 0.25s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                      <span style={{ color: s.accent, fontSize: 16 }}>{s.icon}</span>
                      <span style={{ fontSize: 16, fontFamily: "'Cormorant Garamond', serif" }}>{s.label}</span>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{s.tagline}</p>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 20 }}>›</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {nav === "meditate" && activeSection && section && (
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            <button onClick={() => setActiveSection(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans'", marginBottom: 22, padding: 0, display: "flex", alignItems: "center", gap: 6 }}>← Back</button>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: section.accent, textTransform: "uppercase", marginBottom: 6 }}>{section.icon} {section.label}</div>
            <h2 style={{ fontSize: 28, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, marginBottom: 4 }}>{section.tagline}</h2>
            <div style={{ width: 30, height: 1, background: `${section.accent}66`, marginBottom: 28 }} />

            <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 12 }}>Guided Meditation</div>
            {[section.meditation].map(item => (
              <div key={item.id} onClick={() => !item.comingSoon && handlePlay(item)}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 20px", marginBottom: 28, cursor: item.comingSoon ? "default" : "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { if (!item.comingSoon) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={e => { if (!item.comingSoon) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontFamily: "'Cormorant Garamond', serif" }}>{item.title}</span>
                      <span style={{ background: `${section.accent}22`, color: section.accent, fontSize: 9, padding: "2px 8px", borderRadius: 10, letterSpacing: 1, textTransform: "uppercase" }}>{item.comingSoon ? "Soon" : "Meditation"}</span>
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginBottom: item.comingSoon ? 14 : 0 }}>{item.duration}</div>
                    {item.comingSoon && (
                      !notified ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <input value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)} placeholder="your@email.com"
                            style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 12, fontFamily: "'DM Sans'" }} />
                          <button onClick={e => { e.stopPropagation(); if (notifyEmail) setNotified(true); }}
                            style={{ background: `${section.accent}22`, border: `1px solid ${section.accent}44`, color: section.accent, borderRadius: 8, padding: "8px 14px", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans'", whiteSpace: "nowrap" }}>
                            Notify me
                          </button>
                        </div>
                      ) : <div style={{ fontSize: 12, color: section.accent }}>✓ We'll let you know when Heal is ready</div>
                    )}
                  </div>
                  {!item.comingSoon && (
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: playingTrack?.id === item.id ? section.accent : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: playingTrack?.id === item.id ? "#050f23" : "rgba(255,255,255,0.4)", marginLeft: 12 }}>
                      {playingTrack?.id === item.id && isPlaying ? "⏸" : "▶"}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 12 }}>Music</div>
            {section.trackIds.map(tid => {
              const track = allTracks.find(t => t.id === tid);
              return <TrackRow key={tid} track={track} isPlaying={playingTrack?.id === tid && isPlaying} onPlay={handlePlay} />;
            })}
          </div>
        )}

        {/* ══ MUSIC ══ */}
        {nav === "music" && (
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            <h2 style={{ fontSize: 26, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, marginBottom: 6 }}>All Music</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 20 }}>10 tracks · Solfeggio & sacred tunings</p>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: 16 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.2)", fontSize: 14 }}>⌕</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tracks, Hz, mood..."
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "11px 36px", color: "#fff", fontSize: 13, fontFamily: "'DM Sans'" }} />
              {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 16 }}>×</button>}
            </div>

            {/* Filter chips */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              <button onClick={() => setFilterSection(null)}
                style={{ background: !filterSection ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${!filterSection ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}`, color: !filterSection ? "#fff" : "rgba(255,255,255,0.35)", borderRadius: 20, padding: "7px 16px", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans'", transition: "all 0.2s" }}>
                All
              </button>
              {Object.entries(SECTIONS).map(([key, s]) => (
                <button key={key} onClick={() => setFilterSection(filterSection === key ? null : key)}
                  style={{ background: filterSection===key ? `${s.accent}18` : "rgba(255,255,255,0.03)", border: `1px solid ${filterSection===key ? `${s.accent}40` : "rgba(255,255,255,0.08)"}`, color: filterSection===key ? s.accent : "rgba(255,255,255,0.35)", borderRadius: 20, padding: "7px 14px", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans'", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 5 }}>
                  <span>{s.icon}</span> {s.label}
                </button>
              ))}
            </div>

            {filteredTracks.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>No tracks found</div>
            )}

            {filteredTracks.map(track => (
              <TrackRow key={track.id} track={track} isPlaying={playingTrack?.id === track.id && isPlaying} onPlay={handlePlay}
                showAdd={playlists.length > 0}
                onAdd={(t) => playlists.length === 1 ? toggleTrackInPlaylist(playlists[0].id, t) : setAddingToPlaylist(addingToPlaylist === t.id ? null : t.id)}
                inPlaylist={isInAnyPlaylist(track.id)}
              />
            ))}

            {playlists.length === 0 && (
              <div style={{ textAlign: "center", padding: "20px 0 8px", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 8 }}>
                <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, marginBottom: 10 }}>Save tracks to a playlist</div>
                <button onClick={() => setNav("playlists")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)", borderRadius: 20, padding: "7px 18px", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans'" }}>Create a Playlist</button>
              </div>
            )}

            {addingToPlaylist && (
              <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end" }} onClick={() => setAddingToPlaylist(null)}>
                <div style={{ width: "100%", maxWidth: 480, margin: "0 auto", background: "#0a1f3d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px 20px 0 0", padding: 24 }} onClick={e => e.stopPropagation()}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Add to playlist</div>
                  {playlists.map(pl => (
                    <div key={pl.id} onClick={() => { toggleTrackInPlaylist(pl.id, allTracks.find(t => t.id === addingToPlaylist)); setAddingToPlaylist(null); }}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
                      <span style={{ fontSize: 15, fontFamily: "'Cormorant Garamond', serif" }}>{pl.name}</span>
                      <span style={{ color: isInPlaylist(pl.id, addingToPlaylist) ? "#4a9eff" : "rgba(255,255,255,0.2)", fontSize: 12 }}>{isInPlaylist(pl.id, addingToPlaylist) ? "✓ Added" : "+ Add"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ MY PLAYLISTS ══ */}
        {nav === "playlists" && (
          <div style={{ animation: "fadeUp 0.5s ease both" }}>
            {!currentPlaylist ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <h2 style={{ fontSize: 26, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>My Playlists</h2>
                  <button onClick={() => setCreatingPlaylist(true)} style={{ background: "rgba(74,158,255,0.1)", border: "1px solid rgba(74,158,255,0.3)", color: "#4a9eff", borderRadius: 20, padding: "6px 16px", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans'" }}>+ New</button>
                </div>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 24 }}>Build your personal collection</p>

                {creatingPlaylist && (
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(74,158,255,0.2)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Playlist name</div>
                    <input autoFocus value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)} onKeyDown={e => e.key === "Enter" && createPlaylist()} placeholder="e.g. Evening Wind Down"
                      style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 14, fontFamily: "'DM Sans'", marginBottom: 12 }} />
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={createPlaylist} style={{ flex: 1, background: "linear-gradient(135deg, #4a9eff, #60c4ff)", border: "none", borderRadius: 10, padding: 11, color: "#050f23", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans'" }}>Create</button>
                      <button onClick={() => { setCreatingPlaylist(false); setNewPlaylistName(""); }} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, padding: "11px 16px", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans'" }}>Cancel</button>
                    </div>
                  </div>
                )}

                {playlists.length === 0 && !creatingPlaylist && (
                  <div style={{ textAlign: "center", padding: "56px 0", color: "rgba(255,255,255,0.2)" }}>
                    <div style={{ fontSize: 36, marginBottom: 16, opacity: 0.25 }}>♪</div>
                    <div style={{ fontSize: 15, fontFamily: "'Cormorant Garamond', serif", marginBottom: 6 }}>No playlists yet</div>
                    <div style={{ fontSize: 12 }}>Tap + New to create your first one</div>
                  </div>
                )}

                {playlists.map(pl => (
                  <div key={pl.id} onClick={() => { setActivePlaylist(pl.id); setShuffled(null); }}
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px 20px", marginBottom: 10, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 16, fontFamily: "'Cormorant Garamond', serif", marginBottom: 4 }}>{pl.name}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{pl.tracks.length} track{pl.tracks.length !== 1 ? "s" : ""}</div>
                      </div>
                      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 20 }}>›</span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <button onClick={() => { setActivePlaylist(null); setShuffled(null); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans'", marginBottom: 22, padding: 0, display: "flex", alignItems: "center", gap: 6 }}>← All Playlists</button>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <h2 style={{ fontSize: 26, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{currentPlaylist.name}</h2>
                  {currentPlaylist.tracks.length > 1 && (
                    <button onClick={() => setShuffled(shuffleArr(currentPlaylist.tracks))}
                      style={{ background: shuffled ? "rgba(74,158,255,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${shuffled ? "rgba(74,158,255,0.3)" : "rgba(255,255,255,0.1)"}`, color: shuffled ? "#4a9eff" : "rgba(255,255,255,0.4)", borderRadius: 20, padding: "6px 14px", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans'", display: "flex", alignItems: "center", gap: 5 }}>
                      ⇌ Shuffle
                    </button>
                  )}
                </div>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginBottom: 24 }}>{currentPlaylist.tracks.length} track{currentPlaylist.tracks.length !== 1 ? "s" : ""}</p>

                {currentPlaylist.tracks.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.2)" }}>
                    <div style={{ fontSize: 14, fontFamily: "'Cormorant Garamond', serif", marginBottom: 8 }}>This playlist is empty</div>
                    <div style={{ fontSize: 12, marginBottom: 20 }}>Go to Music to add tracks</div>
                    <button onClick={() => { setNav("music"); setActivePlaylist(null); }} style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)", borderRadius: 20, padding: "8px 20px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans'" }}>Browse Music</button>
                  </div>
                ) : (
                  (shuffled || currentPlaylist.tracks).map(track => (
                    <TrackRow key={track.id} track={track} isPlaying={playingTrack?.id === track.id && isPlaying} onPlay={handlePlay}
                      showAdd onAdd={() => toggleTrackInPlaylist(currentPlaylist.id, track)} inPlaylist={true} />
                  ))
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── PLAYER BAR ── */}
      {playingTrack && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "rgba(5,15,35,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "14px 24px 22px" }}>
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ color: "#fff", fontSize: 14, fontFamily: "'Cormorant Garamond', serif", marginBottom: 2 }}>{playingTrack.title}</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginBottom: 4 }}>{playingTrack.subtitle}</div>
                <SectionTags sections={playingTrack.sections} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: primaryAccent, fontSize: 10, letterSpacing: 1 }}>{playingTrack.hz}</span>
                <button onClick={() => { setPlayingTrack(null); setIsPlaying(false); setProgress(0); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 20 }}>×</button>
              </div>
            </div>
            <div style={{ position: "relative", height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2, marginBottom: 10, cursor: "pointer" }}
              onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setProgress(((e.clientX - r.left) / r.width) * 100); }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${primaryAccent}, #60c4ff)`, borderRadius: 2, transition: "width 0.3s" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>0:00</span>
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 15 }}>⟨⟨</button>
                <button onClick={() => setIsPlaying(p => !p)} style={{ width: 46, height: 46, borderRadius: "50%", background: primaryAccent, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isPlaying ? 13 : 15, color: "#050f23", boxShadow: `0 0 20px ${primaryAccent}44`, transition: "all 0.2s" }}>
                  {isPlaying ? "⏸" : "▶"}
                </button>
                <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 15 }}>⟩⟩</button>
              </div>
              <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>{playingTrack.duration}</span>
            </div>
            {isPlaying && <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}><WaveVisualizer color={primaryAccent} /></div>}
          </div>
        </div>
      )}

      {/* ── PAYWALL ── */}
      {showPaywall && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(5,15,35,0.95)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeUp 0.3s ease both" }}>
          <div style={{ maxWidth: 360, width: "100%", textAlign: "center", position: "relative" }}>
            <button onClick={() => setShowPaywall(false)} style={{ position: "absolute", top: -16, right: 0, background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 22 }}>×</button>
            <div style={{ fontSize: 44, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, marginBottom: 8 }}>aza</div>
            <div style={{ width: 30, height: 1, background: "rgba(255,255,255,0.2)", margin: "0 auto 20px" }} />
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.7, marginBottom: 24, fontWeight: 300 }}>Unlimited access to everything.</p>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 20px", marginBottom: 24, textAlign: "left" }}>
              {["All 10 healing music tracks","All guided meditations","Unlimited custom playlists","New content added monthly"].map((f,i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i<3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span style={{ color: "#4a9eff", fontSize: 12 }}>✓</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "18px 14px" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 8 }}>Monthly</div>
                <div style={{ fontSize: 38, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, marginBottom: 4 }}>$7</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>Cancel anytime</div>
              </div>
              <div style={{ flex: 1, background: "rgba(74,158,255,0.08)", border: "1px solid rgba(74,158,255,0.3)", borderRadius: 14, padding: "18px 14px" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", color: "#4a9eff", textTransform: "uppercase", marginBottom: 4 }}>Yearly</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginBottom: 4 }}>Save 40%</div>
                <div style={{ fontSize: 38, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, marginBottom: 4 }}>$50</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>$4.17/month</div>
              </div>
            </div>
            {!subscribed ? (
              <button onClick={() => { setSubscribed(true); setShowPaywall(false); }} style={{ width: "100%", padding: 15, background: "linear-gradient(135deg, #4a9eff, #60c4ff)", border: "none", borderRadius: 14, color: "#050f23", fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans'", cursor: "pointer", letterSpacing: "0.05em", boxShadow: "0 8px 32px rgba(74,158,255,0.3)", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >Begin — Try Free for 7 Days</button>
            ) : (
              <div style={{ padding: 16, fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#4a9eff" }}>✓ Welcome to Aza.</div>
            )}
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", marginTop: 12 }}>No charge until trial ends</div>
          </div>
        </div>
      )}
    </div>
  );
}
