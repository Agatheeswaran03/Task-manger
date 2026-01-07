import './PriorityBadge.css';

const PriorityBadge = ({ quadrant, showLabel = true }) => {
  const getQuadrantInfo = (quadrant) => {
    const info = {
      Q1: { label: 'Do First', color: 'var(--q1-color)', bgColor: '#FFE5E5' },
      Q2: { label: 'Schedule', color: 'var(--q2-color)', bgColor: '#E0F7F5' },
      Q3: { label: 'Delegate', color: 'var(--q3-color)', bgColor: '#FFF9E0' },
      Q4: { label: 'Eliminate', color: 'var(--q4-color)', bgColor: '#F0F0F0' },
    };
    return info[quadrant] || { label: 'Unknown', color: '#95A5A6', bgColor: '#F0F0F0' };
  };

  const info = getQuadrantInfo(quadrant);

  return (
    <span
      className="priority-badge"
      style={{
        backgroundColor: info.bgColor,
        color: info.color,
      }}
    >
      {quadrant} {showLabel && `- ${info.label}`}
    </span>
  );
};

export default PriorityBadge;

