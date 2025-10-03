import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, MessageSquare } from "lucide-react";
import { useState } from "react";

interface ScheduleConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleConsultationModal({ isOpen, onClose }: ScheduleConsultationModalProps) {
  const [date, setDate] = useState<Date>();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">Schedule a Consultation</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Book a free consultation with our real estate experts
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <form className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    className="rounded-xl bg-input-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    className="rounded-xl bg-input-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="you@example.com" 
                      className="pl-10 rounded-xl bg-input-background"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      className="pl-10 rounded-xl bg-input-background"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Consultation Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Consultation Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Date Picker */}
                <div className="space-y-2">
                  <Label>Preferred Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal rounded-xl bg-input-background"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time Select */}
                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
                    <Select>
                      <SelectTrigger className="pl-10 rounded-xl">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9am">9:00 AM</SelectItem>
                        <SelectItem value="10am">10:00 AM</SelectItem>
                        <SelectItem value="11am">11:00 AM</SelectItem>
                        <SelectItem value="12pm">12:00 PM</SelectItem>
                        <SelectItem value="1pm">1:00 PM</SelectItem>
                        <SelectItem value="2pm">2:00 PM</SelectItem>
                        <SelectItem value="3pm">3:00 PM</SelectItem>
                        <SelectItem value="4pm">4:00 PM</SelectItem>
                        <SelectItem value="5pm">5:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Consultation Type */}
              <div className="space-y-2">
                <Label htmlFor="consultationType">Consultation Type</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select consultation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buying">Buying Property</SelectItem>
                    <SelectItem value="selling">Selling Property</SelectItem>
                    <SelectItem value="renting">Renting Property</SelectItem>
                    <SelectItem value="investment">Investment Advice</SelectItem>
                    <SelectItem value="general">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preferred Method */}
              <div className="space-y-2">
                <Label htmlFor="method">Preferred Method</Label>
                <Select>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="How would you like to meet?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In-Person Meeting</SelectItem>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Additional Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="message">Tell us about your needs</Label>
                <Textarea 
                  id="message" 
                  placeholder="What are you looking for? Any specific requirements or questions..." 
                  className="min-h-32 rounded-xl bg-input-background"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-accent/20 border border-accent/30 rounded-2xl p-4">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Note:</span> Our team will review your request and confirm the appointment within 24 hours. You'll receive a confirmation email with all the details.
              </p>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              Schedule Consultation
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
