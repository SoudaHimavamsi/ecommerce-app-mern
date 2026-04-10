import React from 'react';

const SkeletonCard = () => {
  return (
    <div style={styles.card}>
      <div style={styles.imageSkeleton} className='skeleton' />
      <div style={styles.info}>
        <div style={{ ...styles.line, width: '80%' }} />
        <div style={{ ...styles.line, width: '50%' }} />
        <div style={{ ...styles.line, width: '40%' }} />
        <div style={{ ...styles.line, width: '60%', height: '20px' }} />
        <div style={{ ...styles.line, width: '100%', height: '36px', borderRadius: '6px' }} />
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #eee',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  imageSkeleton: {
    width: '100%',
    height: '200px',
    backgroundColor: '#e0e0e0',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  info: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  line: {
    height: '14px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
};

export default SkeletonCard;