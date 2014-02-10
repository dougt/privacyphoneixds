/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "nsGeoPosition.h"

#include "mozilla/dom/PositionBinding.h"
#include "mozilla/dom/CoordinatesBinding.h"
#include "nsContentUtils.h"
//#include "nsGeolocation.h"
//#include "nsGeolocation.cpp"
#include "nsISettingsService.h"
#include "nsServiceManagerUtils.h"


#define fuzzing 3
#define GEO_LON_BLUR "location.lon"
#define GEO_LAT_BLUR "location.lat"

////////////////////////////////////////////////////
// nsGeoPositionCoords
////////////////////////////////////////////////////
nsGeoPositionCoords::nsGeoPositionCoords(double aLat, double aLong,
                                         double aAlt, double aHError,
                                         double aVError, double aHeading,
                                         double aSpeed)
  : mLat(aLat)
  , mLong(aLong)
  , mAlt(aAlt)
  , mHError(aHError)
  , mVError(aVError)
  , mHeading(aHeading)
  , mSpeed(aSpeed)
{
}

nsGeoPositionCoords::~nsGeoPositionCoords()
{
}

NS_INTERFACE_MAP_BEGIN(nsGeoPositionCoords)
NS_INTERFACE_MAP_ENTRY_AMBIGUOUS(nsISupports, nsIDOMGeoPositionCoords)
NS_INTERFACE_MAP_ENTRY(nsIDOMGeoPositionCoords)
NS_INTERFACE_MAP_END

NS_IMPL_ADDREF(nsGeoPositionCoords)
NS_IMPL_RELEASE(nsGeoPositionCoords)
double LongLat;

class LocationBlurCB : public nsISettingsServiceCallback
{
 public:
  NS_DECL_ISUPPORTS

  LocationBlurCB() {
	  MOZ_COUNT_CTOR(LocationBlurCB);
  }

  virtual ~LocationBlurCB() {
      MOZ_COUNT_DTOR(LocationBlurCB);
  }

  virtual nsresult Handle(const nsAString& aName, const JS::Value &aResult)
  {
    MOZ_ASSERT(NS_IsMainThread());

    LongLat = aResult.toDouble();
    return NS_OK;
  }

  NS_IMETHOD HandleError(const nsAString& aName)
     {
       NS_WARNING("Unable to get value for '" GEO_SETINGS_ENABLED "'");

       // Default it's enabled:
      return NS_OK;
    }
};
/*
double blurLocation(int version, int precision, double *LongLat){

	double maxlat = 90;
	double maxlon = 180;
	double minlat = -90;
	double minlon = -180;
	double ll = 0;
	double ll_err = 0;
	double mid = 0;
	int num_bits = 0;
	int hash_index = 0;
	char *output = (char*)malloc(15);
	const char base32_codes[] = {
	    '0',
	    '1',
	    '2',
	    '3',
	    '4',
	    '5',
	    '6',
	    '7',
	    '8',
	    '9',
	    'b',
	    'c',
	    'd',
	    'e',
	    'f',
	    'g',
	    'h',
	    'j',
	    'k',
	    'm',
	    'n',
	    'p',
	    'q',
	    'r',
	    's',
	    't',
	    'u',
	    'v',
	    'w',
	    'x',
	    'y',
	    'z'
	};


	unsigned int output_length = 0;

	while(output_length < precision) {
		if (version==2) {
			mid = (maxlon + minlon) / 2;
			if(*LongLat > mid) {
				hash_index = (hash_index << 1) + 1;
				minlon=mid;
			} else {
				hash_index = (hash_index << 1) + 0;
				maxlon=mid;
			}
		} else {
			mid = (maxlat + minlat) / 2;
			if(*LongLat > mid ) {
				hash_index = (hash_index << 1) + 1;
				minlat = mid;
			} else {
				hash_index = (hash_index << 1) + 0;
				maxlat = mid;
			}
		}

		++num_bits;
		if (5 == num_bits) {
			output[output_length] = base32_codes[hash_index];

			output_length++;
			num_bits = 0;
			hash_index = 0;
		}
	}
	for(int i = 0; i < strlen(output); i++) {
		//int char_index = base32_codes_index_of(output[i]);
		int char_index;
		for(int j = 0; j < strlen(base32_codes); j++)
		{
			//  cout << "value of j inside the for loop" << j << base32_codes[j] << endl;
			if(base32_codes[j] == output[i])
			{
				char_index=j;
				break;
			}
			else
				continue;
		}

		//cout << "char_index =" << char_index << endl;
		for (int bits = 4; bits >= 0; --bits) {
			int bit = (char_index >> bits) & 1;
			if (version==2) {
				double mid = (maxlon + minlon) / 2;
				if(bit == 1) {
					minlon = mid;
				} else {
					maxlon = mid;
				}
			} else {
				double mid = (maxlat + minlat) / 2;
				if(bit == 1) {
					minlat = mid;
				} else {
					maxlat = mid;
				}
			}
		}
	}
	if (version==2){
		*LongLat = (minlon + maxlon) / 2;
		ll_err = maxlon - ll;
	}
	else{
		*LongLat = (minlat + maxlat) / 2;
		ll_err = maxlat - ll;
	}
	return *LongLat;
}*/
NS_IMPL_ISUPPORTS1(LocationBlurCB, nsISettingsServiceCallback);

nsresult
nsGeoPositionCoords::GetLatitude(double *aLatitude)
{
	/*nsCOMPtr<nsISettingsService> settings =
	   do_GetService("@mozilla.org/settingsService;1");

	if (settings) {
	    nsCOMPtr<nsISettingsServiceLock> settingsLock;
	    nsresult rv = settings->CreateLock(getter_AddRefs(settingsLock));
	    NS_ENSURE_SUCCESS(rv, rv);

	    nsRefPtr<LocationBlurCB> callback = new LocationBlurCB();
	    rv = settingsLock->Get(GEO_LAT_BLUR, callback);
	    NS_ENSURE_SUCCESS(rv, rv);
	}
    if (LongLat == 9999)
    	*aLatitude = mLat;
    else*/
    	*aLatitude = 13.15;
/*
	//*aLatitude = mLat;
  switch (fuzzing)
  	  {
  	   //blur by 20 km
  		case 1:
  			*aLatitude=blurLocation(1,20, aLatitude);
  			*aLatitude = mLat - 0.15;
  			break;
  		//blur by 100 km
  		case 2:
  			*aLatitude=blurLocation(1,100, aLatitude);
  			break;
  		//user defined
  	    case 3:
  	    	*aLatitude = LongLat;
  			break;
  	    default:
  			break;
  	  }

 */
  return NS_OK;
}

nsresult
nsGeoPositionCoords::GetLongitude(double *aLongitude)
{
	/*nsCOMPtr<nsISettingsService> settings =
			do_GetService("@mozilla.org/settingsService;1");

	if (settings) {
	    nsCOMPtr<nsISettingsServiceLock> settingsLock;
		nsresult rv = settings->CreateLock(getter_AddRefs(settingsLock));
		NS_ENSURE_SUCCESS(rv, rv);

		nsRefPtr<LocationBlurCB> callback = new LocationBlurCB();
		rv = settingsLock->Get(GEO_LON_BLUR, callback);
		NS_ENSURE_SUCCESS(rv, rv);
	}
	if (LongLat==9999)
		*aLongitude = mLong;
	else*/
		*aLongitude = 13.15;
/*
  //*aLongitude = mLong;
	switch (fuzzing)
		  {
			//blur by 20 km
			case 1:
				*aLongitude=blurLocation(2,20, aLongitude);
				//*aLongitude = mLong;
				break;
			//blur by 100 km
			case 2:
				*aLongitude=blurLocation(2,100, aLongitude);
				break;
			//user defined
		    case 3:
		    	*aLongitude = LongLat;
				break;
		    default:
				break;
		  }
  */
  return NS_OK;
}

NS_IMETHODIMP
nsGeoPositionCoords::GetAltitude(double *aAltitude)
{
  *aAltitude = mAlt;
  return NS_OK;
}

NS_IMETHODIMP
nsGeoPositionCoords::GetAccuracy(double *aAccuracy)
{
  *aAccuracy = mHError;
  return NS_OK;
}

NS_IMETHODIMP
nsGeoPositionCoords::GetAltitudeAccuracy(double *aAltitudeAccuracy)
{
  *aAltitudeAccuracy = mVError;
  return NS_OK;
}

NS_IMETHODIMP
nsGeoPositionCoords::GetHeading(double *aHeading)
{
  *aHeading = mHeading;
  return NS_OK;
}

NS_IMETHODIMP
nsGeoPositionCoords::GetSpeed(double *aSpeed)
{
  *aSpeed = mSpeed;
  return NS_OK;
}

////////////////////////////////////////////////////
// nsGeoPosition
////////////////////////////////////////////////////

nsGeoPosition::nsGeoPosition(double aLat, double aLong,
                             double aAlt, double aHError,
                             double aVError, double aHeading,
                             double aSpeed, long long aTimestamp) :
    mTimestamp(aTimestamp)
{
    mCoords = new nsGeoPositionCoords(aLat, aLong,
                                      aAlt, aHError,
                                      aVError, aHeading,
                                      aSpeed);
}

nsGeoPosition::nsGeoPosition(nsIDOMGeoPositionCoords *aCoords,
                             long long aTimestamp) :
    mTimestamp(aTimestamp),
    mCoords(aCoords)
{
}

nsGeoPosition::nsGeoPosition(nsIDOMGeoPositionCoords *aCoords,
                             DOMTimeStamp aTimestamp) :
  mTimestamp(aTimestamp),
  mCoords(aCoords)
{
}

nsGeoPosition::~nsGeoPosition()
{
}

NS_INTERFACE_MAP_BEGIN(nsGeoPosition)
NS_INTERFACE_MAP_ENTRY_AMBIGUOUS(nsISupports, nsIDOMGeoPosition)
NS_INTERFACE_MAP_ENTRY(nsIDOMGeoPosition)
NS_INTERFACE_MAP_END

NS_IMPL_ADDREF(nsGeoPosition)
NS_IMPL_RELEASE(nsGeoPosition)

NS_IMETHODIMP
nsGeoPosition::GetTimestamp(DOMTimeStamp* aTimestamp)
{
  *aTimestamp = mTimestamp;
  return NS_OK;
}

NS_IMETHODIMP
nsGeoPosition::GetCoords(nsIDOMGeoPositionCoords * *aCoords)
{
  NS_IF_ADDREF(*aCoords = mCoords);
  return NS_OK;
}

namespace mozilla {
namespace dom {


NS_IMPL_CYCLE_COLLECTION_WRAPPERCACHE_2(Position, mParent, mCoordinates)
NS_IMPL_CYCLE_COLLECTING_ADDREF(Position)
NS_IMPL_CYCLE_COLLECTING_RELEASE(Position)
NS_INTERFACE_MAP_BEGIN_CYCLE_COLLECTION(Position)
  NS_WRAPPERCACHE_INTERFACE_MAP_ENTRY
  NS_INTERFACE_MAP_ENTRY(nsISupports)
NS_INTERFACE_MAP_END

Position::Position(nsISupports* aParent, nsIDOMGeoPosition* aGeoPosition)
  : mParent(aParent)
  , mGeoPosition(aGeoPosition)
{
  SetIsDOMBinding();
}

Position::~Position()
{
}

nsISupports*
Position::GetParentObject() const
{
  return mParent;
}

JSObject*
Position::WrapObject(JSContext* aCx, JS::Handle<JSObject*> aScope)
{
  return PositionBinding::Wrap(aCx, aScope, this);
}

Coordinates*
Position::Coords()
{
  if (!mCoordinates) {
    nsCOMPtr<nsIDOMGeoPositionCoords> coords;
    mGeoPosition->GetCoords(getter_AddRefs(coords));
    MOZ_ASSERT(coords, "coords should not be null");

    mCoordinates = new Coordinates(this, coords);
  }

  return mCoordinates;
}

uint64_t
Position::Timestamp() const
{
  uint64_t rv;

  mGeoPosition->GetTimestamp(&rv);
  return rv;
}

NS_IMPL_CYCLE_COLLECTION_WRAPPERCACHE_1(Coordinates, mPosition)
NS_IMPL_CYCLE_COLLECTING_ADDREF(Coordinates)
NS_IMPL_CYCLE_COLLECTING_RELEASE(Coordinates)
NS_INTERFACE_MAP_BEGIN_CYCLE_COLLECTION(Coordinates)
  NS_WRAPPERCACHE_INTERFACE_MAP_ENTRY
  NS_INTERFACE_MAP_ENTRY(nsISupports)
NS_INTERFACE_MAP_END

Coordinates::Coordinates(Position* aPosition, nsIDOMGeoPositionCoords* aCoords)
  : mPosition(aPosition)
  , mCoords(aCoords)
{
  SetIsDOMBinding();
}

Coordinates::~Coordinates()
{
}

Position*
Coordinates::GetParentObject() const
{
  return mPosition;
}

JSObject*
Coordinates::WrapObject(JSContext* aCx, JS::Handle<JSObject*> aScope)
{
  return CoordinatesBinding::Wrap(aCx, aScope, this);
}

#define GENERATE_COORDS_WRAPPED_GETTER(name) \
double                                       \
Coordinates::name() const                    \
{                                            \
  double rv;                                 \
  mCoords->Get##name(&rv);                   \
  return rv;                                 \
}

#define GENERATE_COORDS_WRAPPED_GETTER_NULLABLE(name) \
Nullable<double>                                      \
Coordinates::Get##name() const                        \
{                                                     \
  double rv;                                          \
  mCoords->Get##name(&rv);                            \
  return Nullable<double>(rv);                        \
}

GENERATE_COORDS_WRAPPED_GETTER(Latitude)
GENERATE_COORDS_WRAPPED_GETTER(Longitude)
GENERATE_COORDS_WRAPPED_GETTER_NULLABLE(Altitude)
GENERATE_COORDS_WRAPPED_GETTER(Accuracy)
GENERATE_COORDS_WRAPPED_GETTER_NULLABLE(AltitudeAccuracy)
GENERATE_COORDS_WRAPPED_GETTER_NULLABLE(Heading)
GENERATE_COORDS_WRAPPED_GETTER_NULLABLE(Speed)

#undef GENERATE_COORDS_WRAPPED_GETTER
#undef GENERATE_COORDS_WRAPPED_GETTER_NULLABLE

} // namespace dom
} // namespace mozilla
