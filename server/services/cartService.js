const cartRepository = require("../repositories/cartRepository");
const { Products_Variant, Carts } = require("../models");

class CartService {
  async getCart(userId) {
    const items = await cartRepository.findUserCart(userId);

    let subtotal = 0;

    const formattedItems = items
      .map((item) => {
        if (!item.variant) {
          cartRepository.deleteCartItem(item.id, userId);
          return null;
        }

        const variantName = [item.variant.color, item.variant.size]
          .filter(Boolean)
          .join(", ");
        const price = parseFloat(item.variant.price);
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;

        return {
          cart_item_id: item.id,
          quantity: item.quantity,
          product_name: item.variant.product.name,
          variant_name: variantName,
          price: price,
          item_total: itemTotal,
          weight: item.variant.product.weight_grams * item.quantity,
          image_url:
            item.variant.images.length > 0
              ? item.variant.images[0].image_url
              : null,
        };
      })
      .filter(Boolean);

    return {
      items: formattedItems,
      subtotal: subtotal,
    };
  }

  async addItem(userId, variantId, quantity) {
    const variant = await Products_Variant.findByPk(variantId);
    if (!variant) {
      throw new Error("Product variant not found");
    }
    if (variant.stock < quantity) {
      throw new Error("Not enough stock");
    }

    const existingItem = await cartRepository.findCartItem(userId, variantId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (variant.stock < newQuantity) {
        throw new Error("Not enough stock to add more");
      }
      await cartRepository.updateCartItem(existingItem.id, {
        quantity: newQuantity,
      });
      return { message: "Item quantity updated in cart" };
    } else {
      await cartRepository.createCartItem({
        user_id: userId,
        variant_id: variantId,
        quantity: quantity,
      });
      return { message: "Item added to cart" };
    }
  }

  async updateItemQuantity(cartItemId, newQuantity, userId) {
    if (newQuantity <= 0) {
      return await this.deleteItem(cartItemId, userId);
    }

    const item = await Carts.findOne({
      where: { id: cartItemId, user_id: userId },
    });
    if (!item) {
      throw new Error("Cart item not found");
    }

    const variant = await Products_Variant.findByPk(item.variant_id);
    if (!variant) {
      throw new Error("Product variant not found");
    }
    if (variant.stock < newQuantity) {
      throw new Error("Not enough stock");
    }

    await cartRepository.updateCartItem(cartItemId, { quantity: newQuantity });
    return { message: "Cart quantity updated" };
  }

  async deleteItem(cartItemId, userId) {
    const result = await cartRepository.deleteCartItem(cartItemId, userId);
    if (result === 0) {
      throw new Error("Cart item not found or does not belong to user");
    }
    return { message: "Item removed from cart" };
  }

  async clearCart(userId) {
    await cartRepository.clearUserCart(userId);
    return { message: "Cart cleared" };
  }
}

module.exports = new CartService();