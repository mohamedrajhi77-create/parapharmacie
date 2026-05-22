import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STORE_INFO } from "@/lib/utils";

export default function MapSection() {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container-pharma">
        <div className="text-center mb-12">
          <span className="inline-block text-pharma-green font-semibold text-sm uppercase tracking-wider mb-3">
            Nous trouver
          </span>
          <h2 className="section-title mb-4">Venez nous rendre visite</h2>
          <p className="text-gray-500 text-lg">Votre parapharmacie de confiance, facilement accessible</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* Info card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-pharma-green-light rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-pharma-green" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-6">{STORE_INFO.name}</h3>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-pharma-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Adresse</p>
                    <p className="text-gray-500 text-sm">{STORE_INFO.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-pharma-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Téléphone</p>
                    <a href={`tel:${STORE_INFO.phone}`} className="text-pharma-green text-sm hover:underline font-medium">
                      {STORE_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-pharma-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Email</p>
                    <a href={`mailto:${STORE_INFO.email}`} className="text-pharma-green text-sm hover:underline font-medium">
                      {STORE_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-pharma-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm mb-2">Horaires d'ouverture</p>
                    <div className="space-y-1.5">
                      {STORE_INFO.hours.map((h) => (
                        <div key={h.day} className="flex justify-between text-sm gap-4">
                          <span className="text-gray-500">{h.day}</span>
                          <span className={`font-medium ${h.time === "Fermé" ? "text-red-500" : "text-gray-900"}`}>
                            {h.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button asChild className="w-full">
                <a href={STORE_INFO.mapUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin className="w-4 h-4" />
                  Itinéraire Google Maps
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-sm border border-gray-100 min-h-[400px] bg-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.847!2d10.186!3d36.867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDUyJzAxLjIiTiAxMMKwMTEnMDkuNiJF!5e0!3m2!1sfr!2stn!4v1699000000000!5m2!1sfr!2stn"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Carte Parapharmacie"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
