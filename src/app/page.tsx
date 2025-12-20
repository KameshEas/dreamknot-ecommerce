import ProductGrid from '@/components/ProductGrid'
import Header from '@/components/Header'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-navy via-blue-900 to-navy">
        {/* Enhanced Background with multiple layers */}
        <div className="absolute inset-0 opacity-15" suppressHydrationWarning>
          <img
            src="/hero-img.png"
            alt="Personalized gifts showcase"
            className="w-full h-full object-cover object-center"
            suppressHydrationWarning
          />
        </div>

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy/80 via-transparent to-deep-gold/20 animate-pulse"></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-float"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-deep-gold/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white/15 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-light-gold/25 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center">
            {/* Enhanced Main Heading with premium animations */}
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-great-vibes text-white mb-6 leading-tight drop-shadow-2xl">
                Personalized
                <span className="block text-transparent bg-gradient-to-r from-deep-gold via-light-gold to-deep-gold bg-clip-text animate-shimmer font-extrabold">
                  Gifts Made
                </span>
                <span className="block text-white/90">Simple</span>
              </h1>
            </div>

            {/* Enhanced Subheading */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <p className="text-lg md:text-xl text-gray-200 font-playfair leading-relaxed mb-8 max-w-2xl mx-auto drop-shadow-lg">
                Create meaningful, custom gifts in minutes. Add your personal touch with text, images, and special messages that tell your unique story.
              </p>
            </div>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-scale-in" style={{ animationDelay: '0.6s' }}>
              <a href="#products" className="group btn-premium text-lg px-8 py-4 shadow-2xl hover:shadow-glow transition-all duration-500 transform hover:scale-105">
                Start Creating
                <svg className="w-5 h-5 inline-block ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H7" />
                </svg>
              </a>
              <button className="border-2 border-white/80 text-white font-playfair font-semibold text-lg px-8 py-4 rounded-2xl hover:bg-white/10 hover:border-white backdrop-blur-sm transition-all duration-500 transform hover:scale-105 hover:shadow-xl">
                Watch Demo
              </button>
            </div>

            {/* Enhanced Trust Indicators with premium styling */}
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <div className="group flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 hover:shadow-lg">
                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-glow">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white font-playfair text-sm font-semibold">Free Shipping</span>
              </div>

              <div className="group flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 hover:shadow-lg">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-glow">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-white font-playfair text-sm font-semibold">Quality Guarantee</span>
              </div>

              <div className="group flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 hover:shadow-lg">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:animate-glow">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-white font-playfair text-sm font-semibold">Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-off-white to-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-navy rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-deep-gold rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-light-gold rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-great-vibes text-navy mb-4 animate-fade-in">How It Works</h2>
            <p className="text-lg text-gray-600 font-playfair max-w-2xl mx-auto leading-relaxed">
              Create personalized gifts in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group text-center card-premium p-8 hover-lift animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-navy to-blue-700 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto shadow-xl group-hover:animate-glow transition-all duration-500">
                  <span className="group-hover:scale-110 transition-transform duration-300">1</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-gold rounded-full animate-float opacity-70"></div>
              </div>
              <h3 className="text-xl font-playfair font-bold text-navy mb-3 group-hover:text-deep-gold transition-colors duration-300">Choose Your Product</h3>
              <p className="text-gray-600 font-playfair text-base leading-relaxed">
                Browse our collection of premium products including mugs, apparel, and home decor items.
              </p>
            </div>

            <div className="group text-center card-premium p-8 hover-lift animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-deep-gold to-light-gold text-navy rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto shadow-xl group-hover:animate-glow transition-all duration-500">
                  <span className="group-hover:scale-110 transition-transform duration-300">2</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-navy to-blue-700 rounded-full animate-float opacity-70"></div>
              </div>
              <h3 className="text-xl font-playfair font-bold text-navy mb-3 group-hover:text-deep-gold transition-colors duration-300">Personalize It</h3>
              <p className="text-gray-600 font-playfair text-base leading-relaxed">
                Add your custom text, upload photos, and choose fonts to make it uniquely yours.
              </p>
            </div>

            <div className="group text-center card-premium p-8 hover-lift animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-light-gold to-deep-gold text-navy rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto shadow-xl group-hover:animate-glow transition-all duration-500">
                  <span className="group-hover:scale-110 transition-transform duration-300">3</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-deep-gold to-light-gold rounded-full animate-float opacity-70"></div>
              </div>
              <h3 className="text-xl font-playfair font-bold text-navy mb-3 group-hover:text-deep-gold transition-colors duration-300">Receive & Enjoy</h3>
              <p className="text-gray-600 font-playfair text-base leading-relaxed">
                We'll craft and deliver your personalized gift with care and attention to detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-great-vibes text-navy mb-3">Our Products</h2>
            <p className="text-base text-gray-600 font-playfair max-w-2xl mx-auto mb-8">
              Premium quality products ready for your personal touch
            </p>
            <a href="/products" className="inline-block bg-navy text-white font-playfair font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              View All Products →
            </a>
          </div>
          <ProductGrid />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-white via-off-white to-light-gold/10 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-40 h-40 border-2 border-deep-gold rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-28 h-28 border-2 border-navy rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 border-2 border-light-gold rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-great-vibes text-navy mb-4 animate-fade-in">What Our Customers Say</h2>
            <p className="text-lg text-gray-600 font-playfair max-w-2xl mx-auto leading-relaxed">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <div className="group card-premium p-8 hover-lift animate-slide-up relative" style={{ animationDelay: '0.2s' }}>
              {/* Quote icon */}
              <div className="absolute top-4 right-4 opacity-20">
                <svg className="w-8 h-8 text-deep-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                </svg>
              </div>

              {/* Star rating with enhanced styling */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="relative">
                    <svg className="w-5 h-5 text-deep-gold fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <div className="absolute inset-0 animate-glow opacity-50"></div>
                  </div>
                ))}
                <span className="ml-2 text-sm text-deep-gold font-playfair font-semibold">5.0</span>
              </div>

              <p className="text-gray-700 font-playfair italic text-base mb-6 leading-relaxed">
                "The personalized mug I created for my dad was perfect. The quality exceeded my expectations and the customization process was incredibly smooth!"
              </p>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-navy to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-great-vibes text-sm">S</span>
                </div>
                <div>
                  <div className="font-playfair font-semibold text-navy text-sm">Sarah M.</div>
                  <div className="text-xs text-gray-500 font-playfair">Verified Customer</div>
                </div>
              </div>
            </div>

            <div className="group card-premium p-8 hover-lift animate-slide-up relative" style={{ animationDelay: '0.4s' }}>
              {/* Quote icon */}
              <div className="absolute top-4 right-4 opacity-20">
                <svg className="w-8 h-8 text-deep-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                </svg>
              </div>

              {/* Star rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="relative">
                    <svg className="w-5 h-5 text-deep-gold fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <div className="absolute inset-0 animate-glow opacity-50"></div>
                  </div>
                ))}
                <span className="ml-2 text-sm text-deep-gold font-playfair font-semibold">5.0</span>
              </div>

              <p className="text-gray-700 font-playfair italic text-base mb-6 leading-relaxed">
                "Easy to use and the results are amazing. My custom t-shirt arrived quickly and looked great. The entire experience was delightful!"
              </p>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-deep-gold to-light-gold rounded-full flex items-center justify-center">
                  <span className="text-navy font-great-vibes text-sm">M</span>
                </div>
                <div>
                  <div className="font-playfair font-semibold text-navy text-sm">Michael R.</div>
                  <div className="text-xs text-gray-500 font-playfair">Verified Customer</div>
                </div>
              </div>
            </div>

            <div className="group card-premium p-8 hover-lift animate-slide-up relative" style={{ animationDelay: '0.6s' }}>
              {/* Quote icon */}
              <div className="absolute top-4 right-4 opacity-20">
                <svg className="w-8 h-8 text-deep-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                </svg>
              </div>

              {/* Star rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="relative">
                    <svg className="w-5 h-5 text-deep-gold fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <div className="absolute inset-0 animate-glow opacity-50"></div>
                  </div>
                ))}
                <span className="ml-2 text-sm text-deep-gold font-playfair font-semibold">5.0</span>
              </div>

              <p className="text-gray-700 font-playfair italic text-base mb-6 leading-relaxed">
                "The customization tools are intuitive and the final product was exactly what I envisioned. DreamKnot has made gifting so much more meaningful!"
              </p>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-light-gold to-deep-gold rounded-full flex items-center justify-center">
                  <span className="text-navy font-great-vibes text-sm">E</span>
                </div>
                <div>
                  <div className="font-playfair font-semibold text-navy text-sm">Emily K.</div>
                  <div className="text-xs text-gray-500 font-playfair">Verified Customer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-navy">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-great-vibes text-white mb-4">
            Ready to Create Your Perfect Gift?
          </h2>
          <p className="text-lg text-blue-100 font-playfair mb-6">
            Join thousands who have discovered the joy of personalized gifting
          </p>
          <a href="#products" className="px-8 py-3 bg-white text-navy font-playfair font-bold rounded-lg hover:bg-gray-100 transition-colors text-base">
            Get Started Now
          </a>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 mt-24 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-deep-gold rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-light-gold rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 border-2 border-white/30 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center shadow-xl">
                    <span className="text-navy font-great-vibes text-lg">D</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-gold rounded-full animate-float"></div>
                </div>
                <span className="text-2xl font-great-vibes text-white">DreamKnot</span>
              </div>
              <p className="text-gray-300 font-playfair text-base leading-relaxed mb-6">
                Making personalized gifts simple, beautiful, and meaningful for every special moment.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.017z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.017z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-playfair font-bold text-white mb-6 text-lg">Products</h3>
              <ul className="space-y-3 text-gray-300 font-playfair">
                <li><a href="/products" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Mugs</a></li>
                <li><a href="/products" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">T-Shirts</a></li>
                <li><a href="/products" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Pillows</a></li>
                <li><a href="/products" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Custom Items</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-playfair font-bold text-white mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-gray-300 font-playfair">
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Help Center</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Shipping</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Returns</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-playfair font-bold text-white mb-6 text-lg">Company</h3>
              <ul className="space-y-3 text-gray-300 font-playfair">
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">About Us</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Blog</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Careers</a></li>
                <li><a href="#" className="hover:text-deep-gold transition-colors duration-300 hover:translate-x-1 inline-block">Press</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 font-playfair text-base">
              &copy; 2025 DreamKnot. Made with <span className="text-red-400 animate-pulse">♥</span> for personalized gifting.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
