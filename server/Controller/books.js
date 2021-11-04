const needle = require('needle');
const db = require('../models');
const { Op } = require("sequelize");
require('dotenv').config();

//  url 디코딩
const decodeURIComponentSafe =s => {
    if (!s) {
      return s;
    }
    return decodeURIComponent(s.replace(/%(?![0-9][0-9a-fA-F]+)/g, "%25"));
  }
// 책 데이터 체크
const bookchk=(res,book)=>{
    if(!book){
        return res.status(500).json({
            msg:'요청해주신 책은 존재하지 않습니다.'
        })
    }
}

module.exports={
    // 카카오 검색
    kakaosearch(req,res){
        //통합 검색
        let api_url='https://dapi.kakao.com/v3/search/book?query=' + encodeURI(req.query.query)+`&size=${req.query.size}&page=${req.query.page}`
        if(req.query.target){
            api_url+=`&target=${req.query.target}`
        }
        const options={
            headers: {"Authorization":` KakaoAK ${process.env.KAKAO_APIKEY}`,'Content-Type': 'text/json;charset=utf-8'}
        }
        needle.get(api_url,options, function (error, response) {
            if (!error && response.statusCode == 200){
               return res.json(response.body);
            }else{
               return res.json({
                    msg:'책이 존재하지 않습니다.'
                })
            }
        });
    },
    // 책  추가
    async addBook(req,res,next){
        try {
            const {title,contents,url,isbn,authors,publisher,datetime,thumbnail} = req.body;
            // 책제목과 isbn,책저자가 같은 책이 있는 지 찾는다.
        const book=await db.Book.findOne({where:{
            [Op.and]: [{ UserId:req.user.id },{title:title},{isbn:isbn},{publisher:publisher},{contents:contents}],
        }})
        //  Amazon S3 버킷을 이용해 이미지를 저장한 후 req.file이 있다면, location를 저장하고,없다면 req.body.thumbnail를 저장한다.
        // let thumbnail=req.file?req.file.location:req.body.thumbnail
        //  책제목과 isbn,책저자가 같은 책이 없다면 새로운 책을 추가한다.
        if(!book){
            const newBook = await db.Book.create({
                title,contents,url,isbn,authors,publisher,datetime,UserId:req.user.id,thumbnail
            },)
           return res.json({
                success:true,
                book:newBook,
                msg:'책이 성공적으로 추가되었습니다.'
            })
        }else{
            return res.status(200).json({
                success:false,
                msg:'이미 추가된 책입니다.'
            })
        }
        } catch (error) {
            console.error(error);
            return next(error);
        }

    },
    // 책들 가져오기
    async fetchBooks(req,res){
        try {
            const page=Number(req.query.page)
            if(isNaN(page)){
                return res.status(400).json({
                    msg:'요청해주신 책들을 불러오지 못했습니다.'
                })
            }
            // 12개씩 가져오기
            let limit=12;
            const offset=page?page*limit:0;
            //  해시태그,좋아요 누른 사용자의 정보,코멘트의 정보를 같이 가져온다.
            const books= await db.Book.findAll({
               limit,
               offset,
               where:{UserId:req.user.id},
                order:[['createdAt','DESC']],
                include:[{
                    model:db.Hashtag,
                    as:'Hashtags',
                    attributes:['id','name']
                },
                {
                    model:db.User,
                    as:'Likers',
                    attributes:['username']
                },{
                    model:db.Comment,
                    order:[['updatedAt','DESC']],
                    include:[{
                        model:db.User,
                        attributes:['id','username']
                    }]
            }]})
            // 전체 책의 갯수
           const totalCount=await db.Book.count({where:{UserId:req.user.id}})
            // 책 데이터, 전체 책의 갯수, 페이지,전체 페이지 정보를 json 객체 형식으로 보여준다.
          return res.json({
               success:true,
               books,
               totalCount,
               page:page+1,
               totalPage:Math.ceil(totalCount/limit)?Math.ceil(totalCount/limit):0
           })
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                msg:'요청해주신 책들을 불러오지 못했습니다.',
                success:false
            })
        }
    },
    // 책 가져오기
    async fetcbBook(req,res,next){
        try {
            // 해시태그, 좋아요 누른 사용자의 정보와 함께 책 정보를 가져온다.
          const book=  await db.Book.findOne({where:{
            [Op.and]: [{ UserId:req.user.id }, { id: req.params.bookId }],
            },
        include:[{
            model:db.Hashtag,
            as:'Hashtags',

        },{
            model:db.User,
            as:'Likers',
            attributes:['username']
        }]})
        // 책 있는지 확인
        bookchk(res,book)
        return res.json({
                success:true,
                book,
            })
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    // 책 삭제하기
    async deleteBook(req,res,next){
        try {
            const book=await db.Book.findOne({where:{
                [Op.and]: [{ UserId:req.user.id }, { id: req.params.bookId }]
                }})
            // 책 있는지 확인
            bookchk(res,book)
            // 책 삭제
            await db.Book.destroy({where:{
                [Op.and]: [{ UserId:req.user.id }, { id: req.params.bookId }],
                }})
            return res.json({
                success:true,
                msg:'성공적으로 제거되었습니다.'
            })
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    // 책 수정
    async updateBook(req,res,next){
        try {
            const exbook=await db.Book.findOne({where:{
                [Op.and]: [{ UserId:req.user.id }, { id: req.params.bookId }]
                }})
            // 책 있는지 확인
            bookchk(res,exbook)
            const {title,contents,url,isbn,authors,publisher,datetime,thumbnail} = req.body;
            // let thumbnail=req.file?req.file.location:req.body.photo
            // 책 수정
            await db.Book.update({
                    title,contents,url,isbn,authors,publisher,datetime,
                    thumbnail
                },{where:{
                    [Op.and]: [{ UserId:req.user.id }, { id: req.params.bookId }]
                    }})

                const book= await db.Book.findOne({where:{
                    [Op.and]: [{ UserId:req.user.id }, { id: req.params.bookId }],
                    },
                    include:[{
                        model:db.Comment,
                        order:[['updatedAt','DESC']],
                        include:[{model:db.User,attributes:['id','username']}]
                    },
                    {
                        model:db.Hashtag,
                        as:'Hashtags',

                    }]})
            return res.json({
                success:true,
                msg:'성공적으로 수정 완료되었습니다.',
                book,
            })
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    // 북마크 추가
    async addBookmark(req,res,next){
        try {
            // bookmark 속성값으로 북마크 유무를 수정해준다.
            await db.Book.update({bookmark:true},{where:{
                [Op.and]: [{ UserId:req.user.id }, { id: req.params.bookId }],
            }})
            return res.json({
                success:true,
                msg:'성공적으로 북마크 추가 완료되었습니다.',
            })
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    // 북마크 삭제
    async removeBookmark(req,res,next){
        try {
            await db.Book.update({bookmark:false},{where:{
                [Op.and]: [{ UserId:req.user.id }, { id: req.params.bookId }],
            }})
            return res.json({
                success:true,
                msg:'성공적으로 북마크 삭제 완료되었습니다.',
            })
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    // 다른 사용자의 책들 가져오기
    // 내 책이 아닌 다른 사용자의 책은 검색할 수  있도록 구현
    async otherFetchBooks(req,res,next){
        try {
            const page=Number(req.query.page)
            if(isNaN(page)){
                return res.status(400).json({
                    msg:'요청해주신 책들을 불러오지 못했습니다.'
                })
            }
            let limit=12;
            let where;
            const offset=page?page*limit:0;
            // 다른 사용자의 책 검색 시,
            if(req.query.search && req.query.target){
                const searchList=["책제목","저자"]
               const target= decodeURIComponentSafe(req.query.target)
               if (req.query.search)

                if (!searchList.includes(req.query.search)) return res.status(400).json({
                    msg:'요청해주신 책은 존재하지 않습니다.'
                })
                switch (req.query.search) {
                    // 책 제목으로 검색
                    case "책제목":
                        where={[Op.and]:[{UserId:{[Op.ne]:req.user.id}},{
                            title:{
                                [Op.like]:`%${target}%`
                            }
                        }]}
                      break;
                    // 저자로 검색
                    case "저자":
                      where={[Op.and]:[{UserId:{[Op.ne]:req.user.id}},{
                            authors:{
                                [Op.like]:`%${target}%`
                            }
                        }]}
                    break;
                    default:
                        break;
                }
            }else{
                // 다른 사용자의 책일 때
                where={UserId:{[Op.ne]:req.user.id}}
            }
            // 조건에 맞는 사용자의 책 데이터 가져오기
          const books=  await db.Book.findAll({
            limit,
            offset,
            where,
            include:[{
                model:db.Hashtag,
                as:'Hashtags',
            },{
              model:db.User,
              attributes:['id','username']
          },
          {
            model:db.User,
            as:'Likers',
            attributes:['id']
        },{
            model:db.User,
            as:'Likers',
            attributes:['username']
        },{
              model:db.Comment,
              order:[['updatedAt','DESC']],
              include:[{
                  model:db.User,
                  attributes:['id','username']
              }]
          }],
        order:[['createdAt','DESC']]})
        // 조건에 맞는 책의 갯수
          const totalCount=await db.Book.count({where})
       return res.json({
            success:true,
            books,
            totalCount,
            page:page+1,
            totalPage:Math.ceil(totalCount/limit)?Math.ceil(totalCount/limit):0
        })
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                msg:'요청해주신 책들을 불러오지 못했습니다.',
                success:false
            })
        }
    },
    // 다른 사용자의 책 가져오기
    async otherFetchBook(req,res,next){
        try {
          const book= await db.Book.findOne({
            where:{
            [Op.and]: [{ UserId:{[Op.ne]:req.user.id} }, { id: req.params.bookId }],
            },
            include:[{
                model:db.User,
                attributes:['id','username']
            },{
                model:db.Hashtag,
                as:'Hashtags',
            },{
                model:db.User,
                as:'Likers',
                attributes:['username']
            }]})
             // 책 있는지 확인
            bookchk(res,book)
            res.json({
                success:true,
                book,
            })
        } catch (error) {
             console.error(error);
             return next(error);
        }
    },
    // 다른사람 책 좋아요
    async otheraddLike(req,res,next){
        try {
            const book = await db.Book.findOne({
                where:{
                    [Op.and]: [{ UserId:{[Op.ne]:req.user.id} }, { id: req.params.bookId }],
            }})
            bookchk(res,book)
            await book.addLiker(req.user.id)
            res.json({ userId: req.user.id });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
    //다른 사람 책 좋아요 해제
    async otherremoveLike(req,res,next){
        try {
            const book = await db.Book.findOne({
                where:{
                    [Op.and]: [{ UserId:{[Op.ne]:req.user.id} }, { id: req.params.bookId }],
            }})
            bookchk(res,book)
            await  book.removeLiker(req.user.id)
            res.json({ userId: req.user.id });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
}

