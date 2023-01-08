const formatPhoneNumber = (phone) => {
    phone = phone.trim()
    if (phone.startsWith('+62')) {
        phone = '0' + phone.slice(3);
    } else if (phone.startsWith('62')) {
        phone = '0' + phone.slice(2);
    }
    return phone.replace(/[- .]/g, '');
}

module.exports = {
    formatPhoneNumber
}