

const firstPage = document.getElementById('first-page');
const secondPage = document.getElementById('second-page');
const startBtn = document.getElementById('start-btn');
const ipAddress = document.getElementById('ip-address');
const lat = document.getElementById('lat');
const long = document.getElementById('long');
const city = document.getElementById('city');
const reg = document.getElementById('reg');
const org = document.getElementById('org');
const host = document.getElementById('hostname');
const map = document.getElementById('map');
const timeZone = document.getElementById('time-zone');
const dateTime = document.getElementById('date-time');
const pincode = document.getElementById('pincode');
const message = document.getElementById('message');
const grid = document.getElementById('grid');

// Function to make the API request
function getGeoInfo(IP) {
    fetch(`https://ipinfo.io/${IP}?token=03299b4873e891`)
      .then(response => response.json())
      .then(data => {
        // Access the relevant geolocation data here (e.g., data.city, data.region, data.country, etc.)
        console.log(data);
        ipAddress.innerText = `IP Address: ${data.ip}`;
        lat.innerText = `Lat: ${data.loc.split(',')[0]}`;
        long.innerText = `Long: ${data.loc.split(',')[1]}`;
        city.innerText = `City: ${data.city}`;
        reg.innerText = `Region: ${data.region}`;
        org.innerText = `Organisation: ${data.org}`;
        host.innerText = `Hostname: ${window.location.hostname}`;

        map.src = `https://maps.google.com/maps?q=${data.loc.split(',')[0]}, ${data.loc.split(',')[0]}&z=15&output=embed`;

        timeZone.innerText = `Time Zone: ${data.timezone}`;
        dateTime.innerText = `Date and Time: ${new Date().toLocaleString("en-US", { timeZone: data.timezone})}`;
        pincode.innerText = `Pincode: ${data.postal}`;

        function getPincode(){
            fetch(`https://api.postalpincode.in/pincode/${data.postal}`)
            .then(response2=> response2.json())
            .then(data2=>{
                console.log(data2);
                message.innerText = `Message: ${data2[0].Message}`;
                for(let i=0;i<data2[0].PostOffice.length;i++){
                  const postOffice = document.createElement('div');
                  postOffice.id = 'post-office';
                  postOffice.innerHTML = `<p>Name: ${data2[0].PostOffice[i].Name} </p>
                  <p>Branch Type: ${data2[0].PostOffice[i].BranchType} </p>
                  <p>Delivery Status: ${data2[0].PostOffice[i].DeliveryStatus} </p>
                  <p>District: ${data2[0].PostOffice[i].District} </p>
                  <p>Division: ${data2[0].PostOffice[i].Division} </p> `

                  grid.appendChild(postOffice);
                }
            })
        }
        getPincode();

      })
      .catch(error => {
        console.error('Error fetching geolocation information:', error);
      });
  }


  // Function to get the user's IP address
  function getUserIP(callback) {
    // Use a 3rd party service to get the IP address
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        // Access the IP address from data.ip
        const userIP = data.ip;
        // document.getElementById('ip-address').textContent = `Your IP Address: ${userIP}`;
        callback(userIP);
      })
      .catch(error => {
        console.error('Error fetching user IP address:', error);
        callback(null);
      });
  }

// Function to start the process on button click
document.getElementById('start-btn').addEventListener('click', () => {
    firstPage.style.display = 'none';
    secondPage.style.display = 'block';
    getUserIP(userIP => {
      if (userIP) {
        getGeoInfo(userIP);
      }
    });
  });




    // Function to filter postal offices based on the search input
    function filterPostalOffices() {
      const searchInput = document.getElementById('search-box').value.toLowerCase();
      const postalOffices = grid.getElementsByTagName('div');
  
      for (const postalOffice of postalOffices) {
        const name = postalOffice.children[0].textContent.toLowerCase();
        const branchType = postalOffice.children[1].textContent.toLowerCase();
  
        if (name.includes(searchInput) || branchType.includes(searchInput)) {
          postalOffice.style.display = 'block';
        } else {
          postalOffice.style.display = 'none';
        }
      }
    }
  
    // Add event listener to the search box
    document.getElementById('search-box').addEventListener('input', filterPostalOffices);

 