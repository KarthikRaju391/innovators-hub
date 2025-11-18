export function getUniqueLocationsForOrder(order) {
  const locations = new Set();

  order.products.forEach((product) => {
    const location = product.startup.location.street1 + ", " + product.startup.location.city;
    locations.add(location);
  });

  return Array.from(locations);
}
