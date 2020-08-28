/**
 * Creates a database row containing all fields contained in a row
 * @param {String} reference 
 * @param {String} description 
 * @param {String} price 
 * @param {String} quantity 
 */
function DatabaseRow(reference, description, price, quantity){
    this.reference = reference;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
}