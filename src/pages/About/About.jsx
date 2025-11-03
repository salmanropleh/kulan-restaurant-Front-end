import React from "react";
import { Users, Award, Heart, Clock } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-20">
        <div className="container-custom section-padding text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Bringing the authentic flavors of East Africa to your table since
            2010
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container-custom section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
                Welcome to KULAN
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                KULAN RESTAURANT was born from a passion to share the rich
                culinary heritage of Somalia and Kenya with the world. Our name
                "KULAN" means "gathering place" in Somali, reflecting our
                mission to create a space where community and culture come
                together over exceptional food.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Founded by the Hassan family in 2010, we've spent over a decade
                perfecting traditional recipes while creating innovative dishes
                that honor our roots. Every spice, every technique, every
                ingredient tells a story of our East African heritage.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">50k+</div>
                  <div className="text-gray-600">Happy Guests</div>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">25+</div>
                  <div className="text-gray-600">Awards</div>
                </div>
                <div className="text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">14+</div>
                  <div className="text-gray-600">Years</div>
                </div>
                <div className="text-center">
                  <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-gray-600">Passion</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3"
                alt="Restaurant interior"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Our Values */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              Our Promise to You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Authentic Flavors
                </h3>
                <p className="text-gray-600">
                  We use traditional recipes passed down through generations,
                  ensuring every dish tells a story of our heritage.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Warm Hospitality</h3>
                <p className="text-gray-600">
                  Experience the famous East African hospitality that makes
                  every guest feel like family.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Quality Ingredients
                </h3>
                <p className="text-gray-600">
                  We source the freshest ingredients and traditional spices to
                  create unforgettable dining experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
