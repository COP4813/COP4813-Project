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
      const compRes = await fetch('/stats/completion-rate');
      const compData = await compRes.json();
      document.getElementById('completionRate').innerText = compData.completionRate;

      // Total Posts
      const postRes = await fetch('/stats/total-posts');
      const postData = await postRes.json();
      document.getElementById('totalPosts').innerText = postData.totalPosts;

      // Posts by Category
      const catRes = await fetch('/stats/posts-by-category');
      const catData = await catRes.json();
      new Chart(document.getElementById('categoryChart'), {
        type: 'bar',
        data: {
          labels: catData.map(d => d._id),
          datasets: [{
            label: 'Posts',
            data: catData.map(d => d.count),
            backgroundColor: '#0d6efd'
          }]
        }
      });

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
        location.reload(); // simple refresh for now
      });
    }

    fetchData();