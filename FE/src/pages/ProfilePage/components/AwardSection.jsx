import React from 'react';

const AwardSection = () => {
  const awards = [
    "U-BDIA AI·SW 페스티벌 전시 출품",
    "AI 융합 데이터 해커톤 경진대회(AI VOYAGE) 수상",
    "우아한 테크코스, SSAFY 합격자 배출",
    "국립부경대학교 우수동아리 은상 선정"
  ];

  return (
    <section className="card award-section-card">
      <div className="award-controls" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select className="text-input" style={{ maxWidth: '120px' }}>
          <option>2026년</option>
        </select>
        <select className="text-input" style={{ maxWidth: '100px' }}>
          <option>1학기</option>
        </select>
        <button className="btn-submit" style={{ height: '48px', padding: '0 20px' }}>학기 추가</button>
      </div>

      <div className="award-group-container" style={{ background: '#f9f9f9', padding: '20px', borderRadius: '12px' }}>
        <div className="award-group-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <span className="font-bold">2025 2학기</span>
          <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✕</button>
        </div>

        <div className="award-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {awards.map((award, index) => (
            <div key={index} className="award-item-row" style={{ display: 'flex', justifyContent: 'space-between', background: '#fff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #eee' }}>
              <span>{award}</span>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ccc' }}>✕</button>
            </div>
          ))}
        </div>

        <button className="award-add-dashed-btn" style={{ marginTop: '15px', width: '100%', border: '2px dashed #FE9A57', background: 'none', color: '#FE9A57', padding: '15px', borderRadius: '8px', cursor: 'pointer' }}>
          + 수상 내역 추가
        </button>
      </div>
    </section>
  );
};

export default AwardSection;    