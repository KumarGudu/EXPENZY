export function generateGroupReportHTML(data: {
  title: string;
  subtitle: string;
  dateRange: string;
  generatedDate: string;
  summaryCards: Array<{ label: string; value: string }>;
  memberSpending: Array<{
    name: string;
    totalSpent: number;
    totalOwed: number;
    transactionCount: number;
    color: string;
  }>;
  transactions: Array<{
    index: number;
    date: string;
    category: string;
    description: string;
    paidBy: string;
    amount: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    @page {
      size: A4;
      margin: 0;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: white;
      color: #0a0a0a;
      line-height: 1.5;
    }
    
    /* Page breaks */
    @page {
      margin-top: 0;
      margin-bottom: 40px;
    }
    
    @page :first {
      margin-top: 0;
    }
    
    .header {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: white;
      padding: 40px 40px 36px 40px;
      page-break-after: avoid;
    }
    
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 6px;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }
    
    .header .subtitle {
      font-size: 14px;
      opacity: 0.85;
      margin-bottom: 10px;
    }
    
    .header .meta {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      opacity: 0.7;
      margin-top: 14px;
    }
    
    .content {
      padding: 36px 40px 40px 40px;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #0a0a0a;
      page-break-after: avoid;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 32px;
      page-break-inside: avoid;
    }
    
    .summary-card {
      background: white;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      padding: 18px 16px;
      position: relative;
      overflow: hidden;
      min-height: 80px;
    }
    
    .summary-card::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #7c3aed;
    }
    
    .summary-card .label {
      font-size: 11px;
      text-transform: uppercase;
      color: #737373;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
      font-weight: 500;
    }
    
    .summary-card .value {
      font-size: 24px;
      font-weight: 700;
      color: #0a0a0a;
      line-height: 1.2;
    }
    
    /* Member Spending Section */
    .member-spending {
      margin-bottom: 32px;
      page-break-inside: avoid;
    }
    
    .member-item {
      display: flex;
      align-items: center;
      padding: 14px 16px;
      background: white;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      margin-bottom: 12px;
      gap: 16px;
    }
    
    .member-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    
    .member-name {
      flex: 1;
      font-size: 14px;
      font-weight: 600;
      color: #0a0a0a;
    }
    
    .member-stats {
      display: flex;
      gap: 24px;
      font-size: 13px;
    }
    
    .member-stat {
      text-align: right;
    }
    
    .member-stat-label {
      font-size: 10px;
      color: #737373;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    
    .member-stat-value {
      font-weight: 600;
      color: #0a0a0a;
    }
    
    /* Transaction Table */
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      overflow: hidden;
      page-break-inside: auto;
      margin-bottom: 32px;
    }
    
    thead {
      background: #1a1a1a;
      color: white;
      page-break-after: avoid;
    }
    
    th {
      padding: 14px 12px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    th:first-child { width: 40px; text-align: center; }
    th:nth-child(2) { width: 80px; }
    th:nth-child(3) { width: 100px; }
    th:nth-child(5) { width: 100px; }
    th:last-child { text-align: right; width: 90px; }
    
    tbody tr {
      border-bottom: 1px solid #e5e5e5;
      page-break-inside: avoid;
    }
    
    tbody tr:nth-child(even) {
      background: #fafafa;
    }
    
    td {
      padding: 12px;
      font-size: 13px;
      vertical-align: middle;
    }
    
    td:first-child {
      text-align: center;
      color: #737373;
      font-weight: 500;
      font-size: 12px;
    }
    
    td:last-child {
      text-align: right;
      font-weight: 600;
      color: #10b981;
    }
    
    /* Category Distribution */
    .category-distribution {
      margin-top: 32px;
      page-break-inside: avoid;
    }
    
    .category-item {
      display: flex;
      align-items: center;
      margin-bottom: 14px;
      gap: 12px;
      page-break-inside: avoid;
    }
    
    .category-color {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    
    .category-name {
      width: 110px;
      font-size: 13px;
      font-weight: 500;
      color: #0a0a0a;
      flex-shrink: 0;
    }
    
    .category-bar-container {
      flex: 1;
      height: 20px;
      background: #fafafa;
      border-radius: 3px;
      overflow: hidden;
    }
    
    .category-bar {
      height: 100%;
      border-radius: 3px;
    }
    
    .category-amount {
      width: 90px;
      text-align: right;
      font-size: 13px;
      font-weight: 600;
      color: #0a0a0a;
      flex-shrink: 0;
    }
    
    .category-percentage {
      width: 50px;
      text-align: right;
      font-size: 12px;
      color: #737373;
      flex-shrink: 0;
    }
    
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${data.title}</h1>
    <div class="subtitle">${data.subtitle}</div>
    <div class="meta">
      <span>${data.dateRange}</span>
      <span>Generated: ${data.generatedDate}</span>
    </div>
  </div>
  
  <div class="content">
    <h2 class="section-title">Summary Overview</h2>
    <div class="summary-grid">
      ${data.summaryCards
        .map(
          (card) => `
        <div class="summary-card">
          <div class="label">${card.label}</div>
          <div class="value">${card.value}</div>
        </div>
      `,
        )
        .join('')}
    </div>
    
    <h2 class="section-title">Member Spending</h2>
    <div class="member-spending">
      ${data.memberSpending
        .map(
          (member) => `
        <div class="member-item">
          <div class="member-color" style="background: ${member.color}"></div>
          <div class="member-name">${member.name}</div>
          <div class="member-stats">
            <div class="member-stat">
              <div class="member-stat-label">Spent</div>
              <div class="member-stat-value">Rs ${member.totalSpent.toFixed(1)}</div>
            </div>
            <div class="member-stat">
              <div class="member-stat-label">Owed</div>
              <div class="member-stat-value">Rs ${member.totalOwed.toFixed(1)}</div>
            </div>
            <div class="member-stat">
              <div class="member-stat-label">Transactions</div>
              <div class="member-stat-value">${member.transactionCount}</div>
            </div>
          </div>
        </div>
      `,
        )
        .join('')}
    </div>
    
    <h2 class="section-title">Transaction Details</h2>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Category</th>
          <th>Description</th>
          <th>Paid By</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        ${data.transactions
          .map(
            (tx) => `
          <tr>
            <td>${tx.index}</td>
            <td>${tx.date}</td>
            <td>${tx.category}</td>
            <td>${tx.description}</td>
            <td>${tx.paidBy}</td>
            <td>Rs ${tx.amount.toFixed(1)}</td>
          </tr>
        `,
          )
          .join('')}
      </tbody>
    </table>
    
    ${
      data.categoryDistribution.length > 0
        ? `
      <div class="page-break"></div>
      <h2 class="section-title">Category Distribution</h2>
      <div class="category-distribution">
        ${data.categoryDistribution
          .map(
            (cat) => `
          <div class="category-item">
            <div class="category-color" style="background: ${cat.color}"></div>
            <div class="category-name">${cat.category}</div>
            <div class="category-bar-container">
              <div class="category-bar" style="width: ${cat.percentage}%; background: ${cat.color}"></div>
            </div>
            <div class="category-amount">Rs ${cat.amount.toFixed(1)}</div>
            <div class="category-percentage">${cat.percentage.toFixed(1)}%</div>
          </div>
        `,
          )
          .join('')}
      </div>
    `
        : ''
    }
  </div>
</body>
</html>
  `;
}
