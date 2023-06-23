// for shop stats configuration upon login/registration (before navigating to the home screen)

export const configureShopStats = async (baseUrl, token, userId) => {
    const endpoint = "shopStats/configureShopStats/";

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  
    const options = {
      method: 'POST',
      headers: headers,
    };
  
    return fetch(baseUrl + endpoint + userId, options)
      .then(response => {
        if (response.status === 403) {
            alert("Since your account is new, shop stats are not yet configured. When you start adding orders to your records and as terms go by, you'll be able to check them out in the 'Shop Stats' tab.");
            return;
        }
        return response.json();
      })
      .then(data => {
        console.log(`Successfully configured ${data} terms of shop stats for user: ${userId}`);
        return;
      })
      .catch(error => {
        console.log(`Error configuring shop stats: ${error}`);
        return;
      });
  };