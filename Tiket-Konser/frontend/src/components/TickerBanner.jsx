const items = [
  '🎸 Echoes of Innocence — 29 Agt 2026',
  '🎤 Westlife World Tour — 15 Sep 2026',
  '🎺 Jazz Under The Stars — 5 Okt 2026',
  '🥁 Synchronize Festival — 3–5 Okt 2026',
  '🎻 Vienna Philharmonic — 20 Nov 2026',
  '🎵 UNGU Final Chapter — 30 Okt 2026',
  '🎹 Raisa Live in Concert — 12 Des 2026',
]

export default function TickerBanner() {
  const doubled = [...items, ...items]
  return (
    <div style={{
      overflow: 'hidden',
      background: 'linear-gradient(90deg, rgba(124,58,237,0.15), rgba(236,72,153,0.1), rgba(124,58,237,0.15))',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      padding: '12px 0',
      position: 'relative',
    }}>
      {/* fades */}
      <div style={{ position:'absolute',left:0,top:0,bottom:0,width:80,background:'linear-gradient(to right,#0a0a0f,transparent)',zIndex:2,pointerEvents:'none' }} />
      <div style={{ position:'absolute',right:0,top:0,bottom:0,width:80,background:'linear-gradient(to left,#0a0a0f,transparent)',zIndex:2,pointerEvents:'none' }} />

      <div className="animate-ticker" style={{ display:'flex', whiteSpace:'nowrap', willChange:'transform' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            display:'inline-flex', alignItems:'center', gap:8,
            marginRight: 40, fontSize:'0.82rem', fontWeight:500, color:'#9ca3af',
          }}>
            {item}
            <span style={{ width:5,height:5,borderRadius:'50%',background:'rgba(167,139,250,0.5)',display:'inline-block' }} />
          </span>
        ))}
      </div>
    </div>
  )
}
