let maxBudget = 0;
            let totalSpent = 0;
            const userId = localStorage.getItem('userId');

            async function fetchBudget() {
                const res = await fetch(`/budget/${userId}`);
                const data = await res.json();
                maxBudget = data.maxBudget;
                totalSpent = data.totalSpent;
                updateDisplay();
            }

            async function setBudget() {
                const input = document.getElementById('maxBudget').value;
                maxBudget = parseFloat(input) || 0;
                await fetch(`/budget/${userId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ maxBudget })
                });
                updateDisplay();
            }

            async function addSpent() {
                const input = document.getElementById('amountSpent').value;
                const amount = parseFloat(input) || 0;
                totalSpent += amount;
                await fetch(`/spend/${userId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount })
                });
                updateDisplay();
            }

            function updateDisplay() {
                document.getElementById('displayMax').textContent = maxBudget.toFixed(2);
                document.getElementById('displaySpent').textContent = totalSpent.toFixed(2);
                document.getElementById('displayRemaining').textContent = (maxBudget - totalSpent).toFixed(2);
            }

            // Fetch budget on page load
            fetchBudget();