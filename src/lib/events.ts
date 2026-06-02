export interface PurchaseFlowOptions {
  movieId?: string;
  ticketType?: string;
}

export const openPurchaseFlow = (options?: PurchaseFlowOptions) => {
  const event = new CustomEvent("open-purchase", { detail: options });
  window.dispatchEvent(event);
};
