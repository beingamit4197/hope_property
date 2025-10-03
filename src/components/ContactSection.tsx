import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { ScheduleConsultationModal } from "./ScheduleConsultationModal";
import { useState } from "react";

export function ContactSection() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  return (
    <section id="contact" className="py-8 md:py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 text-foreground">
            Get In Touch
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to find your dream home? Contact our expert team today
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
          {/* Contact Form */}
          <Card className="border-border rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">
                Send us a message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="First Name"
                    className="rounded-xl bg-input-background border-border"
                  />
                  <Input
                    placeholder="Last Name"
                    className="rounded-xl bg-input-background"
                  />
                </div>
                <Input
                  placeholder="Email Address"
                  type="email"
                  className="rounded-xl bg-input-background"
                />
                <Input
                  placeholder="Phone Number"
                  type="tel"
                  className="rounded-xl bg-input-background"
                />
                <Input
                  placeholder="Subject"
                  className="rounded-xl bg-input-background"
                />
                <Textarea
                  placeholder="Tell us about your property needs..."
                  className="min-h-32 rounded-xl bg-input-background"
                />
                <Button className="w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-6 text-foreground">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center group hover:translate-x-2 transition-transform duration-300">
                  <div
                    className="bg-accent/30 p-3.5 rounded-2xl mr-4 group-hover:bg-accent/40 transition-colors duration-300"
                    style={{ backgroundColor: "rgba(184, 212, 168, 0.3)" }}
                  >
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center group hover:translate-x-2 transition-transform duration-300">
                  <div
                    className="bg-success/30 p-3.5 rounded-2xl mr-4 group-hover:bg-success/40 transition-colors duration-300"
                    style={{ backgroundColor: "rgba(157, 193, 131, 0.3)" }}
                  >
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-muted-foreground">
                      info@hopelivings.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center group hover:translate-x-2 transition-transform duration-300">
                  <div
                    className="bg-warning/30 p-3.5 rounded-2xl mr-4 group-hover:bg-warning/40 transition-colors duration-300"
                    style={{ backgroundColor: "rgba(184, 212, 168, 0.3)" }}
                  >
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Address</p>
                    <p className="text-muted-foreground">
                      123 Linking Road
                      <br />
                      Bandra West, Mumbai 400050
                    </p>
                  </div>
                </div>

                <div className="flex items-center group hover:translate-x-2 transition-transform duration-300">
                  <div
                    className="bg-info/30 p-3.5 rounded-2xl mr-4 group-hover:bg-info/40 transition-colors duration-300"
                    style={{ backgroundColor: "rgba(184, 212, 168, 0.3)" }}
                  >
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Business Hours
                    </p>
                    <p className="text-muted-foreground">
                      Mon - Sat: 10:00 AM - 7:00 PM
                      <br />
                      Sunday: By Appointment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground border-none rounded-2xl shadow-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none"></div>
              <CardContent className="p-6 relative z-10">
                <h4 className="font-semibold mb-2">Ready to get started?</h4>
                <p className="mb-4 opacity-90">
                  Schedule a free consultation with one of our real estate
                  experts.
                </p>
                <Button
                  variant="secondary"
                  className="w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  onClick={() => setIsScheduleOpen(true)}
                >
                  Schedule Consultation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ScheduleConsultationModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
      />
    </section>
  );
}
