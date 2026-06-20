document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------
    // SHOPPING CART CONTROLLER
    // -------------------------------------------------------------
    let cart = [];

    // Load cart from localStorage
    try {
        const storedCart = localStorage.getItem('1327_coffee_cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        }
    } catch (e) {
        console.error("Error reading cart from localStorage:", e);
    }

    const cartBadgeCount = document.getElementById('cartBadgeCount');
    const cartToggleBtn = document.getElementById('cartToggleBtn');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartCGST = document.getElementById('cartCGST');
    const cartSGST = document.getElementById('cartSGST');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutForm = document.getElementById('checkoutForm');

    // Save cart to localStorage
    const saveCart = () => {
        localStorage.setItem('1327_coffee_cart', JSON.stringify(cart));
        updateCartUI();
    };

    // Update Cart UI, count, and totals
    const updateCartUI = () => {
        // Update Nav Badge
        const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartBadgeCount) {
            cartBadgeCount.textContent = totalItemsCount;
        }

        // Render Cart Items
        if (!cartItemsList) return;
        
        if (cart.length === 0) {
            cartItemsList.innerHTML = `<div class="cart-empty-message"><p>Your cart is empty.</p><p style="font-size:0.8rem;margin-top:0.5rem;color:#888;">Select items from the menu to get started!</p></div>`;
            if (cartSubtotal) cartSubtotal.textContent = "₹0";
            if (cartCGST) cartCGST.textContent = "₹0";
            if (cartSGST) cartSGST.textContent = "₹0";
            if (cartTotal) cartTotal.textContent = "₹0";
            return;
        }

        let subtotal = 0;
        cartItemsList.innerHTML = cart.map(item => {
            const itemCost = item.price * item.quantity;
            subtotal += itemCost;
            return `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.price} each</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="btn-qty btn-decrease-qty" data-id="${item.id}">-</button>
                        <span class="cart-item-qty">${item.quantity}</span>
                        <button class="btn-qty btn-increase-qty" data-id="${item.id}">+</button>
                    </div>
                </div>
            `;
        }).join('');

        // Calculate Taxes (9% CGST + 9% SGST = 18% Total GST)
        const cgstCost = Math.round(subtotal * 0.09);
        const sgstCost = Math.round(subtotal * 0.09);
        const totalCost = subtotal + cgstCost + sgstCost;

        if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal}`;
        if (cartCGST) cartCGST.textContent = `₹${cgstCost}`;
        if (cartSGST) cartSGST.textContent = `₹${sgstCost}`;
        if (cartTotal) cartTotal.textContent = `₹${totalCost}`;

        // Bind Quantity Controls
        document.querySelectorAll('.btn-decrease-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const existing = cart.find(item => item.id === id);
                if (existing) {
                    existing.quantity -= 1;
                    if (existing.quantity <= 0) {
                        cart = cart.filter(item => item.id !== id);
                    }
                    saveCart();
                }
            });
        });

        document.querySelectorAll('.btn-increase-qty').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const existing = cart.find(item => item.id === id);
                if (existing) {
                    existing.quantity += 1;
                    saveCart();
                }
            });
        });
    };

    // Add Item to Cart Trigger
    document.querySelectorAll('.btn-add-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseInt(btn.getAttribute('data-price'), 10);

            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }
            saveCart();
            openCartDrawer();
        });
    });

    // Drawer Open/Close Event Listeners
    const openCartDrawer = () => {
        if (cartDrawer) cartDrawer.classList.add('active');
        if (cartOverlay) cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeCartDrawer = () => {
        if (cartDrawer) cartDrawer.classList.remove('active');
        if (cartOverlay) cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCartDrawer);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

    // Initial render
    updateCartUI();

    // Checkout Form Submit -> WhatsApp Redirect
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('checkoutName').value;
            const phone = document.getElementById('checkoutPhone').value;
            const type = document.getElementById('checkoutType').value;

            if (cart.length === 0) {
                alert("Your cart is empty! Please add some coffee or sweets first.");
                return;
            }

            // Build Order Message Text
            let orderLines = [];
            let subtotal = 0;
            cart.forEach(item => {
                const itemCost = item.price * item.quantity;
                subtotal += itemCost;
                orderLines.push(`• ${item.name} x${item.quantity} (₹${itemCost})`);
            });

            const cgst = Math.round(subtotal * 0.09);
            const sgst = Math.round(subtotal * 0.09);
            const total = subtotal + cgst + sgst;

            const waMessage = `*NEW ORDER - 1327 COFFEE SHOP* ☕\n\n` +
                              `*Customer Name:* ${name}\n` +
                              `*Phone:* ${phone}\n` +
                              `*Order Type:* ${type}\n\n` +
                              `*Items:*\n${orderLines.join('\n')}\n\n` +
                              `*Subtotal:* ₹${subtotal}\n` +
                              `*CGST (9%):* ₹${cgst}\n` +
                              `*SGST (9%):* ₹${sgst}\n` +
                              `*Total Bill:* ₹${total}\n\n` +
                              `Please confirm my order and start preparation. Thank you!`;

            // Open in WhatsApp Web or Mobile
            const encodedText = encodeURIComponent(waMessage);
            const waUrl = `https://wa.me/919152313270?text=${encodedText}`;
            
            // Clear cart
            cart = [];
            saveCart();
            closeCartDrawer();
            checkoutForm.reset();

            // Redirect
            window.open(waUrl, '_blank');
        });
    }

    // -------------------------------------------------------------
    // WHATSAPP CHATBOT CONTROLLER
    // -------------------------------------------------------------
    const waLauncherBtn = document.getElementById('waLauncherBtn');
    const waChatBubble = document.getElementById('waChatBubble');
    const botMessagesList = document.getElementById('botMessagesList');
    const botOptionsContainer = document.getElementById('botOptionsContainer');

    if (waLauncherBtn && waChatBubble) {
        waLauncherBtn.addEventListener('click', () => {
            waChatBubble.classList.toggle('active');
        });
    }

    // Chatbot reply helper
    const addMessage = (text, isUser = false) => {
        if (!botMessagesList) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = isUser ? 'user-msg' : 'bot-msg';
        msgDiv.textContent = text;
        botMessagesList.appendChild(msgDiv);
        botMessagesList.scrollTop = botMessagesList.scrollHeight;
    };

    // Chatbot Button Option Clicks
    if (botOptionsContainer) {
        botOptionsContainer.querySelectorAll('.bot-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                const userText = btn.textContent.trim();
                
                // Add User Message Bubble
                addMessage(userText, true);

                // Add Barista Bot reply with small simulated typing delay
                setTimeout(() => {
                    if (action === 'hours') {
                        addMessage("1327 Coffee Shop is open daily! 🕙\n• Monday to Thursday: 10:30 AM – 10:00 PM\n• Friday: 10:30 AM – 11:00 PM\n• Saturday & Sunday: 10:00 AM – 11:00 PM.");
                    } else if (action === 'discount') {
                        addMessage("Yes, we have a flat 10% discount on total dine-in bills! 🏷️ Just mention you are paying via Swiggy Dineout or ask our staff at the counter during billing.");
                    } else if (action === 'directions') {
                        addMessage("We are located at Plot 1327, Rustomjee Global City, Virar West, Mumbai (directly opposite Rustomjee School). 📍 Click the 'Get Directions' button on our Visit page to navigate via Google Maps!");
                    } else if (action === 'human') {
                        addMessage("Got it! Connecting you directly to our lead Barista on WhatsApp... 👤☕");
                        setTimeout(() => {
                            window.open("https://wa.me/919152313270?text=Hello! I am visiting 1327 Coffee Shop and would like to chat.", "_blank");
                        }, 800);
                    }
                }, 600);
            });
        });
    }
});
