import styles from './Dashboard.module.css';

const METHOD_LABEL = { stripe: '💳 Card', paypal: '🅿️ PayPal', crypto: '₿ Crypto', bank: '🏦 Bank' };

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function PaymentHistory({ payments }) {
  if (!payments.length) {
    return <div className={styles.empty}>No payments yet. Choose a plan above to get started.</div>;
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Plan</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{fmtDate(p.created_at)}</td>
              <td>{p.plan}</td>
              <td>{METHOD_LABEL[p.method] || p.method}</td>
              <td>${Number(p.amount).toFixed(2)}</td>
              <td><span className={`${styles.badge} ${styles[`badge_${p.status}`]}`}>{p.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
