document.addEventListener('DOMContentLoaded', () => {
    const assets = document.querySelectorAll('.asset');
    const balanceDisplay = document.querySelector('.balance');
    const scoreDisplay = document.querySelector('.diversification-score');
    const totalValueDisplay = document.querySelector('.total-value');
    const resetBtn = document.querySelector('.reset-btn');
    const nextBtn = document.querySelector('.next-btn');
    const backBtn = document.querySelector('.back-btn');
    const assetInfo = document.querySelector('.asset-info');
    const tipsDisplay = document.querySelector('.tips');
    const chart = document.querySelector('.portfolio-chart');
    const mainContent = document.querySelector('.main-content');
    const bonusContent = document.querySelector('.bonus-content');
    const mainFooter = document.querySelector('.main-footer');
    const bonusFooter = document.querySelector('.bonus-footer');
    const quizSubmitBtn = document.querySelector('.quiz-submit');
    const quizFeedback = document.querySelector('.quiz-feedback');

    let portfolio = {
        stocks: 0,
        bonds: 0,
        etfs: 0,
        cash: 0
    };

    let totalValue = 0;

    assets.forEach(asset => {
        asset.addEventListener('click', () => {
            const assetType = asset.dataset.type;
            const assetValue = parseInt(asset.dataset.value, 10);
            portfolio[assetType]++;
            totalValue += assetValue;
            updateFeedback();

            // Show information about the clicked asset
            let info;
            switch (assetType) {
                case 'stocks':
                    info = 'Stocks represent ownership in a company and offer high return potential with higher risk.';
                    break;
                case 'bonds':
                    info = 'Bonds are fixed income investments that pay interest over time and are generally lower risk.';
                    break;
                case 'etfs':
                    info = 'ETFs are funds that track indexes and can be traded on stock exchanges.';
                    break;
                case 'cash':
                    info = 'Cash and cash equivalents are the most liquid assets with minimal risk and return.';
                    break;
                default:
                    info = 'Click on an asset to see more information.';
            }
            assetInfo.textContent = info;
        });
    });

    resetBtn.addEventListener('click', () => {
        portfolio = {
            stocks: 0,
            bonds: 0,
            etfs: 0,
            cash: 0
        };
        totalValue = 0;
        updateFeedback();
    });

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            mainContent.style.display = 'none';
            bonusContent.style.display = 'block';
            mainFooter.style.display = 'none';
            bonusFooter.style.display = 'block';
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            mainContent.style.display = 'block';
            bonusContent.style.display = 'none';
            mainFooter.style.display = 'block';
            bonusFooter.style.display = 'none';
        });
    }

    if (quizSubmitBtn) {
        quizSubmitBtn.addEventListener('click', () => {
            const selectedOption = document.querySelector('input[name="quiz"]:checked');
            if (selectedOption) {
                const answer = selectedOption.value;
                const correctAnswer = '17.63%';

                if (answer === correctAnswer) {
                    quizFeedback.textContent = 'Correct! You have been keeping up with the market!';
                    quizFeedback.style.color = 'green';
                } else {
                    quizFeedback.textContent = 'Incorrect. Please check the latest financial news and try again.';
                    quizFeedback.style.color = 'red';
                }
            } else {
                quizFeedback.textContent = 'Please select an answer.';
                quizFeedback.style.color = 'red';
            }
        });
    }

    function updateFeedback() {
        const total = portfolio.stocks + portfolio.bonds + portfolio.etfs + portfolio.cash;

        const stockPercent = total ? ((portfolio.stocks / total) * 100).toFixed(0) : 0;
        const bondPercent = total ? ((portfolio.bonds / total) * 100).toFixed(0) : 0;
        const etfPercent = total ? ((portfolio.etfs / total) * 100).toFixed(0) : 0;
        const cashPercent = total ? ((portfolio.cash / total) * 100).toFixed(0) : 0;

        balanceDisplay.textContent = `${stockPercent}% Stocks, ${bondPercent}% Bonds, ${etfPercent}% ETFs, ${cashPercent}% Cash`;

        const diversificationScore = getDiversificationScore(stockPercent, bondPercent, etfPercent, cashPercent);
        scoreDisplay.textContent = diversificationScore;

        totalValueDisplay.textContent = totalValue;

        updatePieChart(stockPercent, bondPercent, etfPercent, cashPercent);
        updateTips(stockPercent, bondPercent, etfPercent, cashPercent);
    }

    function getDiversificationScore(stocks, bonds, etfs, cash) {
        if (stocks > 50 || bonds > 50 || etfs > 50 || cash > 50) {
            return 'Poor';
        } else if (stocks > 25 || bonds > 25 || etfs > 25 || cash > 25) {
            return 'Fair';
        } else {
            return 'Good';
        }
    }

    function updatePieChart(stocks, bonds, etfs, cash) {
        const chartData = [stocks, bonds, etfs, cash];
        const chartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
        let cumulativePercent = 0;

        while (chart.firstChild) {
            chart.removeChild(chart.firstChild);
        }

        chartData.forEach((percent, index) => {
            const percentValue = percent / 100;
            const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
            cumulativePercent += percentValue;
            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
            const largeArcFlag = percentValue > 0.5 ? 1 : 0;

            const pathData = [
                `M 16 16`,
                `L ${startX} ${startY}`,
                `A 16 16 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `L 16 16`
            ].join(' ');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathData);
            path.setAttribute('fill', chartColors[index]);

            chart.appendChild(path);
        });
    }

    function getCoordinatesForPercent(percent) {
        const x = Math.cos(2 * Math.PI * percent) * 16 + 16;
        const y = Math.sin(2 * Math.PI * percent) * 16 + 16;
        return [x, y];
    }

    function updateTips(stocks, bonds, etfs, cash) {
        let tips = 'Consider diversifying your portfolio: ';
        if (stocks > 50) tips += 'You have a high proportion of stocks. ';
        if (bonds > 50) tips += 'You have a high proportion of bonds. ';
        if (etfs > 50) tips += 'You have a high proportion of ETFs. ';
        if (cash > 50) tips += 'You have a high proportion of cash. ';
        tipsDisplay.textContent = tips || 'Your portfolio is well-balanced!';
    }
});
