import { Fragment } from "react";
import Head from "next/head";

import { MongoClient, ObjectId } from "mongodb";

import MeetupList from "../../components/meetups/MeetupList";

import MeetupDetail from "../../components/meetups/meetupDetail";

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description                                                                      } />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://Khushi:tYeT6IuDHL0YeACq@cluster0.6b9gc.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // fetch data for a single meetup

  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://Khushi:tYeT6IuDHL0YeACq@cluster0.6b9gc.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedmeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        meetupIdid: selectedmeetup._id.toString(),
        title: selectedmeetup.title,
        address: selectedmeetup.address,
        image: selectedmeetup.image,
        description: selectedmeetup.description,
      },
    },
  };
}

export default MeetupDetails;
