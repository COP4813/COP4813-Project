async function fetchData() {
      // Total Users
      const totalUsersRes = await fetch('/stats/total-users');
      const totalUsersData = await totalUsersRes.json();
      document.getElementById('totalUsers').innerText = totalUsersData.totalUsers;

      // Active Users
      const activeRes = await fetch('/stats/active-users');
      const activeData = await activeRes.json();
      const activeChart = new Chart(document.getElementById('activeUsersChart'), {
        type: 'doughnut',
        data: {
          labels: ['Active', 'Inactive'],
          datasets: [{
            data: [activeData.activeUsers, activeData.inactiveUsers],
            backgroundColor: ['#28a745', '#6c757d']
          }]
        }
      });

      // Completion Rate
    const completionRes = await fetch('/stats/completed-tasks-percentage');
    const completionData = await completionRes.json();
    document.getElementById('completionRate').innerText = `${completionData.percentage}%`;


      // Registrations Over Time
      const timeframe = document.getElementById('timeframe').value;
      const regRes = await fetch(`/stats/registrations-over-time?timeframe=${timeframe}`);
      const regData = await regRes.json();
      const regChart = new Chart(document.getElementById('registrationsChart'), {
        type: 'line',
        data: {
          labels: regData.map(d => d._id),
          datasets: [{
            label: 'New Users',
            data: regData.map(d => d.count),
            borderColor: '#6610f2',
            fill: false
          }]
        }
      });

      document.getElementById('timeframe').addEventListener('change', async () => {
        location.reload();
      });
    }

    fetchData();