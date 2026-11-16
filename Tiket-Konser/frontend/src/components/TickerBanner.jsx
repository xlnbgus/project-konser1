const items = [
  'Synchronize Festival — 3–5 Okt 2026',
  'Westlife World Tour — 15 Sep 2026',
  'We The Fest (WTF) — 21–23 Agt 2026',
  'Pestapora 2026 — 18–20 Sep 2026',
  'Djakarta Warehouse Project — 11–13 Des 2026',
  'UNGU Final Chapter — 30 Okt 2026',
  'SNOOPY RUN 2026 — 6 Sep 2026',
  'Raisa Live in Concert — 12 Des 2026',
]

export default function TickerBanner() {
  const doubled = [...items, ...items]
  return (
    <div style={{
      overflow: 'hidden',
      background: '#161920',
      borderTop: '1px solid rgba(245,243,238,0.07)',
      borderBottom: '1px solid rgba(245,243,238,0.07)',
      padding: '13px 0',
      position: 'relative',
    }}>
      {/* Fade edges */}
      <div style={{ position:'absolute',left:0,top:0,bottom:0,width:80,background:'linear-gradient(to right,#161920,transparent)',zIndex:2,pointerEvents:'none' }} />
      <div style={{ position:'absolute',right:0,top:0,bottom:0,width:80,background:'linear-gradient(to left,#161920,transparent)',zIndex:2,pointerEvents:'none' }} />

      <div className="animate-ticker" style={{ display:'flex', whiteSpace:'nowrap', willChange:'transform' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            display:'inline-flex', alignItems:'center', gap:12,
            marginRight: 48, fontSize:'0.8rem', fontWeight:500,
            color:'rgba(245,243,238,0.4)',
            fontFamily: "'Manrope', sans-serif",
          }}>
            <span style={{ width:4, height:4, borderRadius:'50%', background:'#D95D39', display:'inline-block', opacity:0.8 }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
