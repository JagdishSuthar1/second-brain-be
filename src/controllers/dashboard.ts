import { RequestHandler } from "express"
import contentModel from "../db/content";
import tagsModel from "../db/tags";
import createEmbeddings from "../geminiModel/embeddings";


type ContentTypeResponse = {
    success: boolean,
    message: string,
    data?: object

}

type ParamsType = {
    userId: string
}
export const UserContent: RequestHandler<ParamsType, ContentTypeResponse, {}> = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    if (userId != undefined) {
        try {
            const content = await contentModel.find({ userId });
            // console.log(content);
            if (content) {
                res.status(200).json({
                    success: true,
                    message: "Data fetched Successfully",
                    data: content
                })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Data Not Found",
                })
            }
        }
        catch (err) {
            console.log(err);
            res.status(404).json({
                success: false,
                message: "Database Issue",
            })
        }
    }

    else {
        res.status(400).json({
            success: false,
            message: "UserId is Not correct"
        })
    }
}

type SpecificContentType = {
    userId: string,
    type: string,
}

export const ContentType: RequestHandler<SpecificContentType, ContentTypeResponse, {}> = async (req, res) => {
    const { userId, type } = req.params;

    if (userId) {
        try {
            const content = await contentModel.find({ userId, type }).populate("allTags");
            // console.log(content);
            if (content) {
                res.status(200).json({
                    success: true,
                    message: "Data fetched Successfully",
                    data: content
                })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Data Not Found",
                })
            }
        }
        catch (err) {
            console.log(err);
            res.status(404).json({
                success: false,
                message: "Database Issue",
            })
        }
    }

    else {
        res.status(400).json({
            success: false,
            message: "UserId is Not correct"
        })
    }
}

type TagProps = {
    title: string
}

// type TagType
export const AddTag: RequestHandler<{ userId: string }, ContentTypeResponse, TagProps> = async (req, res) => {
    const tagBody = req.body;
    const { userId } = req.params

    if (userId) {
        try {
            const tagInDb = await tagsModel.create({ title: tagBody.title })

            res.status(200).json({
                success: true,
                message: "Tag Added Successfully",
                data: tagInDb
            })

        }
        catch (err) {
            console.log(err);
            res.status(404).json({
                success: false,
                message: "Database Issue",
            })
        }
    }

    else {
        res.status(400).json({
            success: false,
            message: "UserId is Not correct"
        })
    }
}


type TagType = {
    _id?: string,
    title: string
}

type ContentDetailType = {
    link: string,
    type: string,
    title: string,
    data: string,
    video_image_url? : string,
    public_id? : string,
    allTags: TagType[],
}

export const AddContent: RequestHandler<{ userId: string }, ContentTypeResponse, ContentDetailType> = async (req, res) => {
    const contentBody = req.body;
    const { userId } = req.params

    if (userId != null && contentBody != null) {
        try {
            console.log("In the add content ", contentBody)
            const stringForEmbedd = `link : ${contentBody.link} , type : ${contentBody.type} , title : ${contentBody.title} , data : ${contentBody.data}`
            const embeddingFromOllama = await createEmbeddings(stringForEmbedd);
            await contentModel.create({
                link: contentBody.link,
                type: contentBody.type,
                title: contentBody.title,
                data: contentBody.data,
                allTags: contentBody.allTags,
                userId: userId,
                video_image_url : contentBody.video_image_url,
                public_id: contentBody.public_id,
                created: new Date().getDate(),
                embedding: embeddingFromOllama
            })

            res.status(200).json({
                success: true,
                message: "Content and Embedding Added Successfully",
            })


            // else {
            //     res.status(400).json({
            //         success: false,
            //         message: "Embedding Not Successfully",
            //     })

        }
        catch (err) {
            console.log(err);
            res.status(404).json({
                success: false,
                message: "Database Issue",
            })
        }
    }

    else {
        res.status(400).json({
            success: false,
            message: "UserId and ContentBody is Not correct"
        })
    }
}


type DeleteContentType = {
    userId: string,
    contentId: string
}

export const DeleteContent: RequestHandler<DeleteContentType, ContentTypeResponse, {}> = async (req, res) => {
    const { userId, contentId } = req.params;

    if (userId) {
        try {
            await contentModel.findByIdAndDelete(contentId);
            const content = await contentModel.find({ userId });
            if (content) {
                res.status(200).json({
                    success: true,
                    message: "Content deleted Successfully",
                    data: content
                })
            }
            else {
                res.status(200).json({
                    success: true,
                    message: "No data found",
                })
            }


        }
        catch (err) {
            console.log(err);
            res.status(404).json({
                success: false,
                message: "Database Issue",
            })
        }
    }

    else {
        res.status(400).json({
            success: false,
            message: "UserId is Not correct"
        })
    }
}

type ContentById = {
    contentId : string
}

export const GetContentById: RequestHandler<ContentById, ContentTypeResponse, {}> = async (req, res) => {
    const {contentId} = req.params;

    if (contentId != undefined) {
        try {
            console.log(contentId);
            const content = await contentModel.findById(contentId);
            console.log(content);

            if (content) {
                res.status(200).json({
                    success: true,
                    message: "Data fetched Successfully",
                    data: content
                })
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "Data Not Found",
                })
            }
        }
        catch (err) {
            console.log(err);
            res.status(404).json({
                success: false,
                message: "Database Issue",
            })
        }
    }

    else {
        res.status(400).json({
            success: false,
            message: "ContentId is Not correct"
        })
    }
}