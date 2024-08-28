 
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    // Reference - https://medium.com/@5066aman/whats-the-deal-with-object-prototype-hasownproperty-call-45bf8f8e1e83
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
       
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

module.exports = pick;
