// create token for proprietor and saving that in cookies
const sendVenueToken = (user, statusCode, res) => {
    const token = user.getJwtToken();
  
    // Options for cookies
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
    };
  
    res.status(statusCode).cookie("proprietor_token", token, options).json({
      success: true,
      user,
      token,
    });
  };
  
  export default sendVenueToken;