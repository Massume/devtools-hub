'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n-context';
import { getJsonLdGeneratorTranslations } from '@/lib/i18n-jsonld-generator';
import toast from 'react-hot-toast';

type SchemaType = 'Article' | 'Product' | 'Organization' | 'Person' | 'LocalBusiness' | 'Event' | 'FAQPage' | 'BreadcrumbList';

interface FAQItem {
  question: string;
  answer: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SchemaData {
  // Article
  articleHeadline: string;
  articleDescription: string;
  articleImage: string;
  articleAuthor: string;
  articlePublisher: string;
  articlePublisherLogo: string;
  articleDatePublished: string;
  articleDateModified: string;
  // Product
  productName: string;
  productDescription: string;
  productImage: string;
  productBrand: string;
  productSku: string;
  productPrice: string;
  productCurrency: string;
  productAvailability: string;
  productRating: string;
  productReviewCount: string;
  // Organization
  orgName: string;
  orgUrl: string;
  orgLogo: string;
  orgDescription: string;
  orgPhone: string;
  orgEmail: string;
  orgSocial: string;
  // Person
  personName: string;
  personJobTitle: string;
  personUrl: string;
  personImage: string;
  personSameAs: string;
  // LocalBusiness
  businessName: string;
  businessType: string;
  businessAddress: string;
  businessCity: string;
  businessState: string;
  businessPostal: string;
  businessCountry: string;
  businessPhone: string;
  businessUrl: string;
  businessPriceRange: string;
  // Event
  eventName: string;
  eventDescription: string;
  eventStartDate: string;
  eventEndDate: string;
  eventLocation: string;
  eventLocationAddress: string;
  eventUrl: string;
  eventImage: string;
  eventPerformer: string;
  eventOfferPrice: string;
  eventOfferCurrency: string;
  eventOfferUrl: string;
}

const DEFAULT_DATA: SchemaData = {
  articleHeadline: '',
  articleDescription: '',
  articleImage: '',
  articleAuthor: '',
  articlePublisher: '',
  articlePublisherLogo: '',
  articleDatePublished: '',
  articleDateModified: '',
  productName: '',
  productDescription: '',
  productImage: '',
  productBrand: '',
  productSku: '',
  productPrice: '',
  productCurrency: 'USD',
  productAvailability: 'InStock',
  productRating: '',
  productReviewCount: '',
  orgName: '',
  orgUrl: '',
  orgLogo: '',
  orgDescription: '',
  orgPhone: '',
  orgEmail: '',
  orgSocial: '',
  personName: '',
  personJobTitle: '',
  personUrl: '',
  personImage: '',
  personSameAs: '',
  businessName: '',
  businessType: 'LocalBusiness',
  businessAddress: '',
  businessCity: '',
  businessState: '',
  businessPostal: '',
  businessCountry: '',
  businessPhone: '',
  businessUrl: '',
  businessPriceRange: '',
  eventName: '',
  eventDescription: '',
  eventStartDate: '',
  eventEndDate: '',
  eventLocation: '',
  eventLocationAddress: '',
  eventUrl: '',
  eventImage: '',
  eventPerformer: '',
  eventOfferPrice: '',
  eventOfferCurrency: 'USD',
  eventOfferUrl: '',
};

export function JsonLdGenerator() {
  const { locale } = useI18n();
  const t = getJsonLdGeneratorTranslations(locale);

  const [schemaType, setSchemaType] = useState<SchemaType>('Article');
  const [data, setData] = useState<SchemaData>(DEFAULT_DATA);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([{ question: '', answer: '' }]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ name: '', url: '' }]);

  const updateData = <K extends keyof SchemaData>(key: K, value: SchemaData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const generatedJsonLd = useMemo(() => {
    let schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': schemaType,
    };

    switch (schemaType) {
      case 'Article':
        if (data.articleHeadline) schema.headline = data.articleHeadline;
        if (data.articleDescription) schema.description = data.articleDescription;
        if (data.articleImage) schema.image = data.articleImage;
        if (data.articleAuthor) schema.author = { '@type': 'Person', name: data.articleAuthor };
        if (data.articlePublisher) {
          schema.publisher = {
            '@type': 'Organization',
            name: data.articlePublisher,
            ...(data.articlePublisherLogo && { logo: { '@type': 'ImageObject', url: data.articlePublisherLogo } }),
          };
        }
        if (data.articleDatePublished) schema.datePublished = data.articleDatePublished;
        if (data.articleDateModified) schema.dateModified = data.articleDateModified;
        break;

      case 'Product':
        if (data.productName) schema.name = data.productName;
        if (data.productDescription) schema.description = data.productDescription;
        if (data.productImage) schema.image = data.productImage;
        if (data.productBrand) schema.brand = { '@type': 'Brand', name: data.productBrand };
        if (data.productSku) schema.sku = data.productSku;
        if (data.productPrice) {
          schema.offers = {
            '@type': 'Offer',
            price: data.productPrice,
            priceCurrency: data.productCurrency,
            availability: `https://schema.org/${data.productAvailability}`,
          };
        }
        if (data.productRating && data.productReviewCount) {
          schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: data.productRating,
            reviewCount: data.productReviewCount,
          };
        }
        break;

      case 'Organization':
        if (data.orgName) schema.name = data.orgName;
        if (data.orgUrl) schema.url = data.orgUrl;
        if (data.orgLogo) schema.logo = data.orgLogo;
        if (data.orgDescription) schema.description = data.orgDescription;
        if (data.orgPhone) schema.telephone = data.orgPhone;
        if (data.orgEmail) schema.email = data.orgEmail;
        if (data.orgSocial) {
          schema.sameAs = data.orgSocial.split('\n').filter(Boolean);
        }
        break;

      case 'Person':
        if (data.personName) schema.name = data.personName;
        if (data.personJobTitle) schema.jobTitle = data.personJobTitle;
        if (data.personUrl) schema.url = data.personUrl;
        if (data.personImage) schema.image = data.personImage;
        if (data.personSameAs) {
          schema.sameAs = data.personSameAs.split('\n').filter(Boolean);
        }
        break;

      case 'LocalBusiness':
        schema['@type'] = data.businessType || 'LocalBusiness';
        if (data.businessName) schema.name = data.businessName;
        if (data.businessAddress || data.businessCity) {
          schema.address = {
            '@type': 'PostalAddress',
            ...(data.businessAddress && { streetAddress: data.businessAddress }),
            ...(data.businessCity && { addressLocality: data.businessCity }),
            ...(data.businessState && { addressRegion: data.businessState }),
            ...(data.businessPostal && { postalCode: data.businessPostal }),
            ...(data.businessCountry && { addressCountry: data.businessCountry }),
          };
        }
        if (data.businessPhone) schema.telephone = data.businessPhone;
        if (data.businessUrl) schema.url = data.businessUrl;
        if (data.businessPriceRange) schema.priceRange = data.businessPriceRange;
        break;

      case 'Event':
        if (data.eventName) schema.name = data.eventName;
        if (data.eventDescription) schema.description = data.eventDescription;
        if (data.eventStartDate) schema.startDate = data.eventStartDate;
        if (data.eventEndDate) schema.endDate = data.eventEndDate;
        if (data.eventLocation) {
          schema.location = {
            '@type': 'Place',
            name: data.eventLocation,
            ...(data.eventLocationAddress && { address: data.eventLocationAddress }),
          };
        }
        if (data.eventUrl) schema.url = data.eventUrl;
        if (data.eventImage) schema.image = data.eventImage;
        if (data.eventPerformer) schema.performer = { '@type': 'Person', name: data.eventPerformer };
        if (data.eventOfferPrice) {
          schema.offers = {
            '@type': 'Offer',
            price: data.eventOfferPrice,
            priceCurrency: data.eventOfferCurrency,
            ...(data.eventOfferUrl && { url: data.eventOfferUrl }),
          };
        }
        break;

      case 'FAQPage':
        schema.mainEntity = faqItems
          .filter(item => item.question && item.answer)
          .map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          }));
        break;

      case 'BreadcrumbList':
        schema.itemListElement = breadcrumbs
          .filter(item => item.name && item.url)
          .map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          }));
        break;
    }

    return JSON.stringify(schema, null, 2);
  }, [schemaType, data, faqItems, breadcrumbs]);

  const handleCopy = async () => {
    const scriptTag = `<script type="application/ld+json">\n${generatedJsonLd}\n</script>`;
    await navigator.clipboard.writeText(scriptTag);
    toast.success(t.copied);
  };

  const clearAll = () => {
    setData(DEFAULT_DATA);
    setFaqItems([{ question: '', answer: '' }]);
    setBreadcrumbs([{ name: '', url: '' }]);
  };

  const schemaTypes: { value: SchemaType; label: string }[] = [
    { value: 'Article', label: t.typeArticle },
    { value: 'Product', label: t.typeProduct },
    { value: 'Organization', label: t.typeOrganization },
    { value: 'Person', label: t.typePerson },
    { value: 'LocalBusiness', label: t.typeLocalBusiness },
    { value: 'Event', label: t.typeEvent },
    { value: 'FAQPage', label: t.typeFAQ },
    { value: 'BreadcrumbList', label: t.typeBreadcrumb },
  ];

  const renderField = (key: keyof SchemaData, label: string, placeholder?: string, type: string = 'text') => (
    <div>
      <label className="block text-sm font-medium text-hub-muted mb-2">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={data[key]}
          onChange={(e) => updateData(key, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent resize-none"
        />
      ) : (
        <input
          type={type}
          value={data[key]}
          onChange={(e) => updateData(key, e.target.value)}
          placeholder={placeholder}
          className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={clearAll}
          className="px-3 py-1 text-sm bg-hub-darker border border-hub-border rounded-lg hover:border-hub-accent/50 transition-colors"
        >
          {t.clearAll}
        </button>
      </div>

      {/* Schema Type */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4">
        <label className="block text-sm font-medium text-hub-muted mb-3">{t.schemaType}</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {schemaTypes.map(type => (
            <button
              key={type.value}
              onClick={() => setSchemaType(type.value)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                schemaType === type.value
                  ? 'bg-hub-accent text-white border-hub-accent'
                  : 'bg-hub-darker border-hub-border hover:border-hub-accent/50'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-4 space-y-4">
        {schemaType === 'Article' && (
          <>
            {renderField('articleHeadline', t.articleHeadline, t.articleHeadlinePlaceholder)}
            {renderField('articleDescription', t.articleDescription, t.articleDescriptionPlaceholder, 'textarea')}
            {renderField('articleImage', t.articleImage, t.articleImagePlaceholder, 'url')}
            {renderField('articleAuthor', t.articleAuthor, t.articleAuthorPlaceholder)}
            {renderField('articlePublisher', t.articlePublisher, t.articlePublisherPlaceholder)}
            {renderField('articlePublisherLogo', t.articlePublisherLogo, '', 'url')}
            <div className="grid sm:grid-cols-2 gap-4">
              {renderField('articleDatePublished', t.articleDatePublished, '', 'datetime-local')}
              {renderField('articleDateModified', t.articleDateModified, '', 'datetime-local')}
            </div>
          </>
        )}

        {schemaType === 'Product' && (
          <>
            {renderField('productName', t.productName, t.productNamePlaceholder)}
            {renderField('productDescription', t.productDescription, '', 'textarea')}
            {renderField('productImage', t.productImage, '', 'url')}
            <div className="grid sm:grid-cols-2 gap-4">
              {renderField('productBrand', t.productBrand)}
              {renderField('productSku', t.productSku)}
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {renderField('productPrice', t.productPrice)}
              <div>
                <label className="block text-sm font-medium text-hub-muted mb-2">{t.productCurrency}</label>
                <select
                  value={data.productCurrency}
                  onChange={(e) => updateData('productCurrency', e.target.value)}
                  className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="RUB">RUB</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-hub-muted mb-2">{t.productAvailability}</label>
                <select
                  value={data.productAvailability}
                  onChange={(e) => updateData('productAvailability', e.target.value)}
                  className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
                >
                  <option value="InStock">{t.availabilityInStock}</option>
                  <option value="OutOfStock">{t.availabilityOutOfStock}</option>
                  <option value="PreOrder">{t.availabilityPreOrder}</option>
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {renderField('productRating', t.productRating)}
              {renderField('productReviewCount', t.productReviewCount)}
            </div>
          </>
        )}

        {schemaType === 'Organization' && (
          <>
            {renderField('orgName', t.orgName, t.orgNamePlaceholder)}
            {renderField('orgUrl', t.orgUrl, '', 'url')}
            {renderField('orgLogo', t.orgLogo, '', 'url')}
            {renderField('orgDescription', t.orgDescription, '', 'textarea')}
            <div className="grid sm:grid-cols-2 gap-4">
              {renderField('orgPhone', t.orgPhone)}
              {renderField('orgEmail', t.orgEmail, '', 'email')}
            </div>
            {renderField('orgSocial', t.orgSocial, '', 'textarea')}
          </>
        )}

        {schemaType === 'Person' && (
          <>
            {renderField('personName', t.personName)}
            {renderField('personJobTitle', t.personJobTitle)}
            {renderField('personUrl', t.personUrl, '', 'url')}
            {renderField('personImage', t.personImage, '', 'url')}
            {renderField('personSameAs', t.personSameAs, '', 'textarea')}
          </>
        )}

        {schemaType === 'LocalBusiness' && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              {renderField('businessName', t.businessName)}
              {renderField('businessType', t.businessType)}
            </div>
            {renderField('businessAddress', t.businessAddress)}
            <div className="grid sm:grid-cols-2 gap-4">
              {renderField('businessCity', t.businessCity)}
              {renderField('businessState', t.businessState)}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {renderField('businessPostal', t.businessPostal)}
              {renderField('businessCountry', t.businessCountry)}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {renderField('businessPhone', t.businessPhone)}
              {renderField('businessUrl', t.businessUrl, '', 'url')}
            </div>
            {renderField('businessPriceRange', t.businessPriceRange)}
          </>
        )}

        {schemaType === 'Event' && (
          <>
            {renderField('eventName', t.eventName)}
            {renderField('eventDescription', t.eventDescription, '', 'textarea')}
            <div className="grid sm:grid-cols-2 gap-4">
              {renderField('eventStartDate', t.eventStartDate, '', 'datetime-local')}
              {renderField('eventEndDate', t.eventEndDate, '', 'datetime-local')}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {renderField('eventLocation', t.eventLocation)}
              {renderField('eventLocationAddress', t.eventLocationAddress)}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {renderField('eventUrl', t.eventUrl, '', 'url')}
              {renderField('eventImage', t.eventImage, '', 'url')}
            </div>
            {renderField('eventPerformer', t.eventPerformer)}
            <div className="grid sm:grid-cols-3 gap-4">
              {renderField('eventOfferPrice', t.eventOfferPrice)}
              <div>
                <label className="block text-sm font-medium text-hub-muted mb-2">{t.eventOfferCurrency}</label>
                <select
                  value={data.eventOfferCurrency}
                  onChange={(e) => updateData('eventOfferCurrency', e.target.value)}
                  className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="RUB">RUB</option>
                </select>
              </div>
              {renderField('eventOfferUrl', t.eventOfferUrl, '', 'url')}
            </div>
          </>
        )}

        {schemaType === 'FAQPage' && (
          <>
            {faqItems.map((item, index) => (
              <div key={index} className="border border-hub-border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-hub-muted">FAQ #{index + 1}</span>
                  {faqItems.length > 1 && (
                    <button
                      onClick={() => setFaqItems(prev => prev.filter((_, i) => i !== index))}
                      className="text-xs text-red-400 hover:underline"
                    >
                      {t.faqRemove}
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-hub-muted mb-2">{t.faqQuestion}</label>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const newItems = [...faqItems];
                      newItems[index].question = e.target.value;
                      setFaqItems(newItems);
                    }}
                    className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-hub-muted mb-2">{t.faqAnswer}</label>
                  <textarea
                    value={item.answer}
                    onChange={(e) => {
                      const newItems = [...faqItems];
                      newItems[index].answer = e.target.value;
                      setFaqItems(newItems);
                    }}
                    rows={2}
                    className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent resize-none"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => setFaqItems(prev => [...prev, { question: '', answer: '' }])}
              className="px-4 py-2 text-sm bg-hub-accent text-white rounded-lg hover:bg-hub-accent/80 transition-colors"
            >
              {t.faqAdd}
            </button>
          </>
        )}

        {schemaType === 'BreadcrumbList' && (
          <>
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-hub-muted mb-2">{t.breadcrumbName}</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...breadcrumbs];
                      newItems[index].name = e.target.value;
                      setBreadcrumbs(newItems);
                    }}
                    className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-hub-muted mb-2">{t.breadcrumbUrl}</label>
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => {
                      const newItems = [...breadcrumbs];
                      newItems[index].url = e.target.value;
                      setBreadcrumbs(newItems);
                    }}
                    className="w-full bg-hub-darker border border-hub-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-hub-accent"
                  />
                </div>
                {breadcrumbs.length > 1 && (
                  <button
                    onClick={() => setBreadcrumbs(prev => prev.filter((_, i) => i !== index))}
                    className="px-3 py-2 text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setBreadcrumbs(prev => [...prev, { name: '', url: '' }])}
              className="px-4 py-2 text-sm bg-hub-accent text-white rounded-lg hover:bg-hub-accent/80 transition-colors"
            >
              {t.breadcrumbAdd}
            </button>
          </>
        )}
      </div>

      {/* Generated Code */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-hub-muted">{t.generatedCode}</label>
          <button
            onClick={handleCopy}
            className="text-sm text-hub-accent hover:underline"
          >
            {t.copyButton}
          </button>
        </div>
        <pre className="bg-hub-darker border border-hub-border rounded-lg p-4 overflow-x-auto">
          <code className="text-sm text-green-400 font-mono whitespace-pre">
            {`<script type="application/ld+json">\n${generatedJsonLd}\n</script>`}
          </code>
        </pre>
      </div>

      {/* Features */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{t.featuresTitle}</h3>
        <ul className="grid md:grid-cols-2 gap-2">
          {[t.feature1, t.feature2, t.feature3, t.feature4].map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-hub-muted">
              <span className="text-hub-accent">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* About */}
      <div className="bg-hub-card border border-hub-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-2">{t.aboutTitle}</h3>
        <p className="text-hub-muted">{t.aboutText}</p>
      </div>
    </div>
  );
}
